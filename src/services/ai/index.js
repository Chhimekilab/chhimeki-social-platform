// AI Service Orchestrator
// This is the main entry point for all AI features

import trendDetection from './trendDetection';
import contentGenerator from './contentGenerator';
import moderation from './moderation';
import realTimeService from './realTimeService';
import scheduler from './scheduler';

// Service status
let serviceStatus = {
  initialized: false,
  services: {
    trendDetection: false,
    contentGenerator: false,
    moderation: false,
    realTimeService: false,
    scheduler: false
  },
  lastHealthCheck: null,
  errors: []
};

/**
 * Initialize all AI services
 */
export const initializeAIServices = async () => {
  try {
    console.log('🚀 Initializing AI services...');
    
    // Initialize real-time service first
    realTimeService.initializeRealTimeConnection();
    serviceStatus.services.realTimeService = true;
    
    // Initialize other services
    serviceStatus.services.trendDetection = true;
    serviceStatus.services.contentGenerator = true;
    serviceStatus.services.moderation = true;
    serviceStatus.services.scheduler = true;
    
    serviceStatus.initialized = true;
    serviceStatus.lastHealthCheck = new Date().toISOString();
    
    console.log('✅ AI services initialized successfully');
    
    return {
      success: true,
      message: 'AI services initialized successfully',
      services: serviceStatus.services
    };
    
  } catch (error) {
    console.error('❌ Failed to initialize AI services:', error);
    serviceStatus.errors.push({
      message: error.message,
      timestamp: new Date().toISOString()
    });
    
    return {
      success: false,
      message: 'Failed to initialize AI services',
      error: error.message
    };
  }
};

/**
 * Get service health status
 */
export const getServiceHealth = () => {
  const realTimeStatus = realTimeService.getConnectionStatus();
  const schedulerStatus = scheduler.getSchedulerStatus();
  
  return {
    overall: serviceStatus.initialized,
    services: {
      trendDetection: serviceStatus.services.trendDetection,
      contentGenerator: serviceStatus.services.contentGenerator,
      moderation: serviceStatus.services.moderation,
      realTimeService: realTimeStatus.connected,
      scheduler: schedulerStatus.isRunning
    },
    details: {
      realTime: realTimeStatus,
      scheduler: schedulerStatus,
      lastHealthCheck: serviceStatus.lastHealthCheck,
      errors: serviceStatus.errors.slice(-5) // Last 5 errors
    }
  };
};

/**
 * Start all AI services
 */
export const startAIServices = async () => {
  try {
    console.log('🔄 Starting AI services...');
    
    // Start scheduler
    scheduler.startScheduler();
    
    // Start real-time simulation if in development
    if (process.env.REACT_APP_ENV === 'development') {
      realTimeService.simulateRealTimeEvents();
    }
    
    console.log('✅ AI services started successfully');
    
    return {
      success: true,
      message: 'AI services started successfully'
    };
    
  } catch (error) {
    console.error('❌ Failed to start AI services:', error);
    return {
      success: false,
      message: 'Failed to start AI services',
      error: error.message
    };
  }
};

/**
 * Stop all AI services
 */
export const stopAIServices = () => {
  try {
    console.log('🛑 Stopping AI services...');
    
    // Stop scheduler
    scheduler.stopScheduler();
    
    // Disconnect real-time service
    realTimeService.disconnect();
    
    // Update service status
    Object.keys(serviceStatus.services).forEach(service => {
      serviceStatus.services[service] = false;
    });
    
    console.log('✅ AI services stopped successfully');
    
    return {
      success: true,
      message: 'AI services stopped successfully'
    };
    
  } catch (error) {
    console.error('❌ Failed to stop AI services:', error);
    return {
      success: false,
      message: 'Failed to stop AI services',
      error: error.message
    };
  }
};

/**
 * Get trending topics
 */
export const getTrendingTopics = async (limit = 10) => {
  try {
    // First try to get from cache
    const cached = scheduler.getCachedTrendingTopics();
    if (cached.trends.length > 0 && !cached.is_stale) {
      return {
        trends: cached.trends.slice(0, limit),
        source: 'cache',
        updated_at: cached.updated_at
      };
    }
    
    // If cache is stale or empty, fetch fresh data
    const trends = await trendDetection.getTrendingTopics(limit);
    
    return {
      trends: trends,
      source: 'fresh',
      updated_at: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error getting trending topics:', error);
    throw error;
  }
};

/**
 * Generate AI content for a specific topic
 */
export const generateContent = async (topic, type = 'post') => {
  try {
    switch (type) {
      case 'post':
        return await contentGenerator.generateTrendPost(topic);
      case 'comment':
        return await contentGenerator.generateCommentResponse(topic.comment, topic.context);
      case 'variations':
        return await contentGenerator.generatePostVariations(topic, topic.count || 3);
      default:
        throw new Error(`Unsupported content type: ${type}`);
    }
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
};

/**
 * Moderate content
 */
export const moderateContent = async (content, type = 'post') => {
  try {
    switch (type) {
      case 'post':
        return await moderation.moderatePost(content);
      case 'comment':
        return await moderation.moderateComment(content);
      case 'batch':
        return await moderation.batchModerate(content);
      default:
        return await moderation.moderateContent(content.content || content, type);
    }
  } catch (error) {
    console.error('Error moderating content:', error);
    throw error;
  }
};

/**
 * Get AI analytics data
 */
export const getAIAnalytics = () => {
  try {
    const schedulerStatus = scheduler.getSchedulerStatus();
    const aiPosts = scheduler.getAIPosts();
    const trends = scheduler.getCachedTrendingTopics();
    
    // Calculate engagement metrics
    const totalLikes = aiPosts.reduce((sum, post) => sum + (post.likes || 0), 0);
    const totalComments = aiPosts.reduce((sum, post) => sum + (post.comments || 0), 0);
    const totalShares = aiPosts.reduce((sum, post) => sum + (post.shares || 0), 0);
    
    const avgEngagement = aiPosts.length > 0 ? 
      (totalLikes + totalComments + totalShares) / aiPosts.length : 0;
    
    return {
      overview: {
        totalPosts: schedulerStatus.stats.postsGenerated,
        totalTrends: schedulerStatus.stats.trendsDetected,
        totalModerations: schedulerStatus.stats.moderationChecks,
        averageEngagement: avgEngagement.toFixed(2)
      },
      recent: {
        posts: aiPosts.slice(0, 10),
        trends: trends.trends.slice(0, 10),
        logs: scheduler.getSchedulerLogs(10)
      },
      performance: {
        postsPerHour: schedulerStatus.stats.postsGenerated / 
          (schedulerStatus.uptime / (1000 * 60 * 60)) || 0,
        trendsPerHour: schedulerStatus.stats.trendsDetected / 
          (schedulerStatus.uptime / (1000 * 60 * 60)) || 0,
        uptime: schedulerStatus.uptime
      }
    };
    
  } catch (error) {
    console.error('Error getting AI analytics:', error);
    return {
      overview: { totalPosts: 0, totalTrends: 0, totalModerations: 0, averageEngagement: 0 },
      recent: { posts: [], trends: [], logs: [] },
      performance: { postsPerHour: 0, trendsPerHour: 0, uptime: 0 }
    };
  }
};

/**
 * Subscribe to real-time AI events
 */
export const subscribeToAIEvents = (eventType, callback) => {
  return realTimeService.subscribe(eventType, callback);
};

/**
 * Join live thread for real-time interactions
 */
export const joinLiveThread = (postId, callbacks) => {
  return realTimeService.joinLiveThread(postId, callbacks);
};

/**
 * Send live interaction
 */
export const sendLiveInteraction = (postId, type, data) => {
  return realTimeService.sendLiveInteraction(postId, type, data);
};

/**
 * Force generate AI content
 */
export const forceGenerateContent = async () => {
  try {
    return await scheduler.forceGenerateContent();
  } catch (error) {
    console.error('Error force generating content:', error);
    throw error;
  }
};

/**
 * Get AI posts
 */
export const getAIPosts = (limit = 20) => {
  try {
    const posts = scheduler.getAIPosts();
    return posts.slice(0, limit);
  } catch (error) {
    console.error('Error getting AI posts:', error);
    return [];
  }
};

/**
 * Analyze content quality
 */
export const analyzeContentQuality = (content) => {
  try {
    return contentGenerator.analyzeContentQuality(content);
  } catch (error) {
    console.error('Error analyzing content quality:', error);
    return { qualityScore: 0, recommendations: [], isOptimal: false };
  }
};

/**
 * Get moderation statistics
 */
export const getModerationStats = () => {
  try {
    // Get recent moderation results from localStorage
    const moderationResults = JSON.parse(localStorage.getItem('moderation_results') || '[]');
    return moderation.getModerationStats(moderationResults);
  } catch (error) {
    console.error('Error getting moderation stats:', error);
    return { total: 0, flagged: 0, approved: 0, flagRate: 0 };
  }
};

/**
 * Update AI configuration
 */
export const updateAIConfig = (config) => {
  try {
    console.log('⚙️ Updating AI configuration:', config);
    
    // Update scheduler configuration
    if (config.scheduler) {
      scheduler.updateSchedulerConfig(config.scheduler);
    }
    
    // Update environment variables
    if (config.environment) {
      Object.keys(config.environment).forEach(key => {
        process.env[key] = config.environment[key];
      });
    }
    
    return {
      success: true,
      message: 'AI configuration updated successfully'
    };
    
  } catch (error) {
    console.error('Error updating AI configuration:', error);
    return {
      success: false,
      message: 'Failed to update AI configuration',
      error: error.message
    };
  }
};

/**
 * Get AI service logs
 */
export const getServiceLogs = (service = 'all', limit = 50) => {
  try {
    switch (service) {
      case 'scheduler':
        return scheduler.getSchedulerLogs(limit);
      case 'all':
      default:
        return [
          ...scheduler.getSchedulerLogs(limit / 2),
          ...serviceStatus.errors.slice(-limit / 2)
        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
  } catch (error) {
    console.error('Error getting service logs:', error);
    return [];
  }
};

/**
 * Clear service logs
 */
export const clearServiceLogs = (service = 'all') => {
  try {
    switch (service) {
      case 'scheduler':
        scheduler.clearSchedulerLogs();
        break;
      case 'all':
      default:
        scheduler.clearSchedulerLogs();
        serviceStatus.errors = [];
        break;
    }
    
    return {
      success: true,
      message: `${service} logs cleared successfully`
    };
    
  } catch (error) {
    console.error('Error clearing service logs:', error);
    return {
      success: false,
      message: 'Failed to clear service logs',
      error: error.message
    };
  }
};

// Export all services for direct access if needed
export {
  trendDetection,
  contentGenerator,
  moderation,
  realTimeService,
  scheduler
};

// Main AI service object
const AIService = {
  // Initialization
  initialize: initializeAIServices,
  start: startAIServices,
  stop: stopAIServices,
  
  // Health and status
  getHealth: getServiceHealth,
  getAnalytics: getAIAnalytics,
  getLogs: getServiceLogs,
  clearLogs: clearServiceLogs,
  
  // Core features
  getTrendingTopics,
  generateContent,
  moderateContent,
  analyzeContentQuality,
  
  // Posts and content
  getAIPosts,
  forceGenerateContent,
  
  // Real-time features
  subscribeToAIEvents,
  joinLiveThread,
  sendLiveInteraction,
  
  // Statistics
  getModerationStats,
  
  // Configuration
  updateConfig: updateAIConfig,
  
  // Direct service access
  services: {
    trendDetection,
    contentGenerator,
    moderation,
    realTimeService,
    scheduler
  }
};

// Auto-initialize if enabled
if (process.env.REACT_APP_ENABLE_AI_POSTS === 'true') {
  setTimeout(async () => {
    await initializeAIServices();
    await startAIServices();
  }, 1000);
}

export default AIService;