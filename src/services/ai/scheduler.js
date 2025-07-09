import cron from 'node-cron';
import { v4 as uuidv4 } from 'uuid';
import { getTrendingTopics } from './trendDetection';
import { generateTrendPost } from './contentGenerator';
import { moderatePost } from './moderation';
import { sendLiveInteraction } from './realTimeService';

// Scheduler state
let schedulerState = {
  isRunning: false,
  tasks: new Map(),
  logs: [],
  stats: {
    postsGenerated: 0,
    trendsDetected: 0,
    moderationChecks: 0,
    lastRun: null,
    nextRun: null
  }
};

// Mock post creation function (in production, this would save to database)
const createAIPost = async (postData) => {
  console.log('📝 Creating AI post:', postData);
  
  // Simulate database save
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const post = {
    id: uuidv4(),
    content: postData.content,
    author: 'Chhimeki AI',
    user_id: '00000000-0000-0000-0000-000000000001',
    is_ai_generated: true,
    ai_content_id: postData.metadata.id,
    trend_topic_id: postData.metadata.trend_topic_id,
    created_at: new Date().toISOString(),
    likes: 0,
    comments: 0,
    shares: 0,
    ...postData.metadata
  };
  
  // Add to mock database
  const existingPosts = JSON.parse(localStorage.getItem('ai_posts') || '[]');
  existingPosts.unshift(post);
  localStorage.setItem('ai_posts', JSON.stringify(existingPosts.slice(0, 50))); // Keep last 50
  
  // Broadcast to real-time service
  sendLiveInteraction('global', 'ai_post_generated', { post });
  
  return post;
};

/**
 * Main AI content generation task
 */
const generateAIContent = async () => {
  try {
    console.log('🤖 Starting AI content generation cycle...');
    
    const startTime = Date.now();
    
    // Step 1: Get trending topics
    const trends = await getTrendingTopics(5);
    schedulerState.stats.trendsDetected += trends.length;
    
    if (trends.length === 0) {
      console.log('⚠️ No trending topics found, skipping content generation');
      return;
    }
    
    // Step 2: Select best trend for content generation
    const selectedTrend = trends[0]; // Take highest scoring trend
    console.log(`🎯 Selected trend: ${selectedTrend.topic}`);
    
    // Step 3: Generate content
    const generatedContent = await generateTrendPost(selectedTrend);
    
    // Step 4: Moderate content
    const moderationResult = await moderatePost({
      content: generatedContent.content,
      type: 'post'
    });
    
    schedulerState.stats.moderationChecks++;
    
    // Step 5: Post if approved
    if (moderationResult.approved) {
      const post = await createAIPost({
        ...generatedContent,
        metadata: {
          ...generatedContent.metadata,
          trend_topic_id: selectedTrend.id,
          generation_time: Date.now() - startTime,
          moderation_result: moderationResult.moderation
        }
      });
      
      schedulerState.stats.postsGenerated++;
      
      // Log success
      addLog('success', `AI post generated: "${post.content.substring(0, 50)}..."`);
      
      console.log(`✅ AI post created successfully: ${post.id}`);
      
      return post;
    } else {
      addLog('warning', `AI post blocked by moderation: ${moderationResult.moderationMessage}`);
      console.log('❌ AI post blocked by moderation');
      return null;
    }
    
  } catch (error) {
    console.error('Error in AI content generation:', error);
    addLog('error', `AI content generation failed: ${error.message}`);
    throw error;
  }
};

/**
 * Clean up old AI posts
 */
const cleanupOldPosts = async () => {
  try {
    console.log('🧹 Cleaning up old AI posts...');
    
    const posts = JSON.parse(localStorage.getItem('ai_posts') || '[]');
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentPosts = posts.filter(post => 
      new Date(post.created_at) > oneWeekAgo
    );
    
    localStorage.setItem('ai_posts', JSON.stringify(recentPosts));
    
    const removedCount = posts.length - recentPosts.length;
    if (removedCount > 0) {
      addLog('info', `Cleaned up ${removedCount} old AI posts`);
    }
    
  } catch (error) {
    console.error('Error cleaning up old posts:', error);
  }
};

/**
 * Update trending topics cache
 */
const updateTrendingTopics = async () => {
  try {
    console.log('📈 Updating trending topics cache...');
    
    const trends = await getTrendingTopics(20);
    
    // Store in localStorage for quick access
    localStorage.setItem('trending_topics', JSON.stringify({
      trends,
      updated_at: new Date().toISOString(),
      next_update: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes
    }));
    
    addLog('info', `Updated trending topics cache with ${trends.length} topics`);
    
  } catch (error) {
    console.error('Error updating trending topics:', error);
  }
};

/**
 * Add log entry
 */
const addLog = (level, message) => {
  const logEntry = {
    id: uuidv4(),
    level,
    message,
    timestamp: new Date().toISOString()
  };
  
  schedulerState.logs.unshift(logEntry);
  
  // Keep only last 100 logs
  if (schedulerState.logs.length > 100) {
    schedulerState.logs = schedulerState.logs.slice(0, 100);
  }
  
  console.log(`📋 [${level.toUpperCase()}] ${message}`);
};

/**
 * Start the AI scheduler
 */
export const startScheduler = () => {
  if (schedulerState.isRunning) {
    console.log('⚠️ Scheduler is already running');
    return;
  }
  
  console.log('🚀 Starting AI scheduler...');
  
  schedulerState.isRunning = true;
  schedulerState.stats.lastRun = new Date().toISOString();
  
  // Main content generation task - every 5 minutes
  const contentTask = cron.schedule('*/5 * * * *', async () => {
    if (!schedulerState.isRunning) return;
    
    try {
      await generateAIContent();
      schedulerState.stats.lastRun = new Date().toISOString();
      
      // Calculate next run
      const nextRun = new Date();
      nextRun.setMinutes(nextRun.getMinutes() + 5);
      schedulerState.stats.nextRun = nextRun.toISOString();
      
    } catch (error) {
      console.error('Error in scheduled content generation:', error);
    }
  });
  
  // Trending topics update - every 15 minutes
  const trendsTask = cron.schedule('*/15 * * * *', async () => {
    if (!schedulerState.isRunning) return;
    
    try {
      await updateTrendingTopics();
    } catch (error) {
      console.error('Error in scheduled trends update:', error);
    }
  });
  
  // Cleanup task - every hour
  const cleanupTask = cron.schedule('0 * * * *', async () => {
    if (!schedulerState.isRunning) return;
    
    try {
      await cleanupOldPosts();
    } catch (error) {
      console.error('Error in scheduled cleanup:', error);
    }
  });
  
  // Store tasks
  schedulerState.tasks.set('content', contentTask);
  schedulerState.tasks.set('trends', trendsTask);
  schedulerState.tasks.set('cleanup', cleanupTask);
  
  // Calculate next run
  const nextRun = new Date();
  nextRun.setMinutes(nextRun.getMinutes() + 5);
  schedulerState.stats.nextRun = nextRun.toISOString();
  
  addLog('info', 'AI scheduler started successfully');
  
  // Run initial content generation
  setTimeout(async () => {
    if (schedulerState.isRunning) {
      await generateAIContent();
    }
  }, 5000); // Wait 5 seconds for initialization
};

/**
 * Stop the AI scheduler
 */
export const stopScheduler = () => {
  if (!schedulerState.isRunning) {
    console.log('⚠️ Scheduler is not running');
    return;
  }
  
  console.log('🛑 Stopping AI scheduler...');
  
  schedulerState.isRunning = false;
  
  // Stop all tasks
  schedulerState.tasks.forEach((task, name) => {
    task.destroy();
    console.log(`❌ Stopped ${name} task`);
  });
  
  schedulerState.tasks.clear();
  schedulerState.stats.nextRun = null;
  
  addLog('info', 'AI scheduler stopped');
};

/**
 * Get scheduler status
 */
export const getSchedulerStatus = () => {
  return {
    isRunning: schedulerState.isRunning,
    activeTasks: Array.from(schedulerState.tasks.keys()),
    stats: { ...schedulerState.stats },
    logs: schedulerState.logs.slice(0, 20), // Return last 20 logs
    uptime: schedulerState.stats.lastRun ? 
      Date.now() - new Date(schedulerState.stats.lastRun).getTime() : 0
  };
};

/**
 * Get AI posts
 */
export const getAIPosts = () => {
  try {
    const posts = JSON.parse(localStorage.getItem('ai_posts') || '[]');
    return posts.map(post => ({
      ...post,
      relativeTime: getRelativeTime(post.created_at)
    }));
  } catch (error) {
    console.error('Error getting AI posts:', error);
    return [];
  }
};

/**
 * Get relative time string
 */
const getRelativeTime = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diff = now - time;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};

/**
 * Force generate AI content (manual trigger)
 */
export const forceGenerateContent = async () => {
  if (!schedulerState.isRunning) {
    throw new Error('Scheduler is not running');
  }
  
  console.log('🔄 Force generating AI content...');
  addLog('info', 'Manual AI content generation triggered');
  
  return await generateAIContent();
};

/**
 * Get trending topics from cache
 */
export const getCachedTrendingTopics = () => {
  try {
    const cached = localStorage.getItem('trending_topics');
    if (cached) {
      const data = JSON.parse(cached);
      return {
        trends: data.trends || [],
        updated_at: data.updated_at,
        next_update: data.next_update,
        is_stale: new Date(data.next_update) < new Date()
      };
    }
  } catch (error) {
    console.error('Error getting cached trending topics:', error);
  }
  
  return { trends: [], updated_at: null, next_update: null, is_stale: true };
};

/**
 * Update scheduler configuration
 */
export const updateSchedulerConfig = (config) => {
  // In production, this would update the cron schedules
  console.log('⚙️ Updating scheduler configuration:', config);
  
  addLog('info', 'Scheduler configuration updated');
  
  // For demo purposes, just log the changes
  if (config.contentInterval) {
    console.log(`Content generation interval: ${config.contentInterval} minutes`);
  }
  
  if (config.trendsInterval) {
    console.log(`Trends update interval: ${config.trendsInterval} minutes`);
  }
};

/**
 * Get scheduler logs
 */
export const getSchedulerLogs = (limit = 50) => {
  return schedulerState.logs.slice(0, limit);
};

/**
 * Clear scheduler logs
 */
export const clearSchedulerLogs = () => {
  schedulerState.logs = [];
  addLog('info', 'Scheduler logs cleared');
};

// Auto-start scheduler in development
if (process.env.REACT_APP_ENV === 'development' && process.env.REACT_APP_ENABLE_AI_POSTS === 'true') {
  setTimeout(() => {
    startScheduler();
  }, 3000); // Wait 3 seconds after module load
}

export default {
  startScheduler,
  stopScheduler,
  getSchedulerStatus,
  getAIPosts,
  forceGenerateContent,
  getCachedTrendingTopics,
  updateSchedulerConfig,
  getSchedulerLogs,
  clearSchedulerLogs
};