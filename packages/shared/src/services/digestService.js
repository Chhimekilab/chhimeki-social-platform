/**
 * Backend Digest Service
 * Server-side digest generation and processing
 */

const cron = require('node-cron');

// Mock news API - in production, this would fetch from real news APIs
const mockNewsData = {
  technology: [
    {
      id: 1,
      title: "AI Revolution in Healthcare: New Diagnostic Tools Show 95% Accuracy",
      summary: "Revolutionary AI diagnostic tools are being deployed in hospitals worldwide, showing unprecedented accuracy in early disease detection.",
      source: "TechCrunch",
      publishedAt: new Date().toISOString(),
      category: "AI & Healthcare",
      importance: "high"
    },
    {
      id: 2,
      title: "Quantum Computing Breakthrough: IBM Announces 1000-Qubit Processor",
      summary: "IBM's latest quantum processor marks a significant milestone in quantum computing, promising to solve complex problems previously thought impossible.",
      source: "MIT Technology Review",
      publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      category: "Quantum Computing",
      importance: "high"
    },
    {
      id: 3,
      title: "Meta's New VR Platform Gains 10 Million Users in First Week",
      summary: "Meta's latest virtual reality platform has seen explosive growth, attracting millions of users seeking immersive digital experiences.",
      source: "The Verge",
      publishedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      category: "VR/AR",
      importance: "medium"
    }
  ],
  
  politics: [
    {
      id: 1,
      title: "Global Climate Summit Reaches Historic Agreement on Carbon Reduction",
      summary: "World leaders have agreed to ambitious new carbon reduction targets, marking a significant step forward in global climate action.",
      source: "Reuters",
      publishedAt: new Date().toISOString(),
      category: "Climate Policy",
      importance: "high"
    },
    {
      id: 2,
      title: "Digital Privacy Bill Passes Senate with Bipartisan Support",
      summary: "A comprehensive digital privacy protection bill has gained broad support, promising enhanced user rights and data protection.",
      source: "Associated Press",
      publishedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      category: "Digital Rights",
      importance: "high"
    }
  ],
  
  business: [
    {
      id: 1,
      title: "Electric Vehicle Market Surpasses $500 Billion Milestone",
      summary: "The global electric vehicle market has reached a new valuation record, driven by increased consumer adoption and government incentives.",
      source: "Bloomberg",
      publishedAt: new Date().toISOString(),
      category: "Automotive",
      importance: "high"
    },
    {
      id: 2,
      title: "Cryptocurrency Regulations Provide Market Stability",
      summary: "New regulatory frameworks for cryptocurrencies are bringing stability to the market, attracting institutional investors.",
      source: "Wall Street Journal",
      publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      category: "Cryptocurrency",
      importance: "medium"
    }
  ]
};

// Add mock data for other topics
const otherTopics = ['science', 'health', 'environment', 'sports', 'entertainment', 'finance', 'education', 'travel', 'food'];

otherTopics.forEach(topic => {
  mockNewsData[topic] = [
    {
      id: 1,
      title: `Breaking: Major ${topic.charAt(0).toUpperCase() + topic.slice(1)} Development`,
      summary: `Significant developments in the ${topic} sector are reshaping industry standards and consumer expectations.`,
      source: "Industry News",
      publishedAt: new Date().toISOString(),
      category: topic.charAt(0).toUpperCase() + topic.slice(1),
      importance: "medium"
    },
    {
      id: 2,
      title: `Innovation in ${topic.charAt(0).toUpperCase() + topic.slice(1)}: New Trends Emerge`,
      summary: `Emerging trends in ${topic} are creating new opportunities and challenges for industry professionals.`,
      source: "Sector Report",
      publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      category: topic.charAt(0).toUpperCase() + topic.slice(1),
      importance: "low"
    }
  ];
});

/**
 * Generate digest for a topic
 * @param {string} topicId - Topic identifier
 * @param {string} frequency - Digest frequency
 * @returns {Promise<Object>} Generated digest
 */
const generateDigest = async (topicId, frequency = 'weekly') => {
  const newsItems = mockNewsData[topicId] || [];
  const topicName = topicId.charAt(0).toUpperCase() + topicId.slice(1);
  
  // Generate AI summary
  const aiSummary = generateAISummary(newsItems, frequency, topicName);
  
  // Generate insights and trending topics
  const keyInsights = generateKeyInsights(newsItems, topicName);
  const trending = generateTrendingTopics(newsItems);
  
  // Calculate reading time
  const readingTime = calculateReadingTime(newsItems, frequency);
  
  return {
    id: `digest_${topicId}_${Date.now()}`,
    topicId,
    topicName,
    frequency,
    generatedAt: new Date().toISOString(),
    aiSummary,
    newsItems: newsItems.slice(0, frequency === 'daily' ? 3 : frequency === 'weekly' ? 5 : 10),
    keyInsights,
    trending,
    readingTime
  };
};

/**
 * Generate AI summary
 * @param {Array} newsItems - News items
 * @param {string} frequency - Digest frequency
 * @param {string} topicName - Topic name
 * @returns {string} AI summary
 */
const generateAISummary = (newsItems, frequency, topicName) => {
  const timeframe = frequency === 'daily' ? 'today' : frequency === 'weekly' ? 'this week' : 'this month';
  
  if (newsItems.length === 0) {
    return `No significant ${topicName.toLowerCase()} news to report ${timeframe}. Stay tuned for updates!`;
  }
  
  const highImportanceCount = newsItems.filter(item => item.importance === 'high').length;
  const mediumImportanceCount = newsItems.filter(item => item.importance === 'medium').length;
  
  let summary = `Here's your ${frequency} ${topicName} digest for ${timeframe}:\n\n`;
  
  if (highImportanceCount > 0) {
    summary += `🚨 **Major Developments**: ${highImportanceCount} high-impact ${highImportanceCount === 1 ? 'story' : 'stories'} ${highImportanceCount === 1 ? 'is' : 'are'} shaping the ${topicName.toLowerCase()} landscape. `;
  }
  
  if (mediumImportanceCount > 0) {
    summary += `📈 **Notable Updates**: ${mediumImportanceCount} significant ${mediumImportanceCount === 1 ? 'development' : 'developments'} worth your attention. `;
  }
  
  summary += `\n\nKey themes ${timeframe} include: ${newsItems.map(item => item.category).join(', ')}. `;
  
  const insights = [
    `The ${topicName.toLowerCase()} sector continues to evolve rapidly with new innovations and regulatory changes.`,
    `Market dynamics are shifting as consumer preferences and technological capabilities advance.`,
    `Industry leaders are adapting to emerging trends while maintaining competitive advantages.`,
    `Global events and policy changes are creating both opportunities and challenges for stakeholders.`
  ];
  
  summary += `\n\n💡 **AI Analysis**: ${insights[Math.floor(Math.random() * insights.length)]}`;
  
  return summary;
};

/**
 * Generate key insights
 * @param {Array} newsItems - News items
 * @param {string} topicName - Topic name
 * @returns {Array} Key insights
 */
const generateKeyInsights = (newsItems, topicName) => {
  const insights = [];
  const categories = [...new Set(newsItems.map(item => item.category))];
  
  categories.forEach(category => {
    const categoryItems = newsItems.filter(item => item.category === category);
    insights.push({
      category,
      insight: `${categoryItems.length} ${categoryItems.length === 1 ? 'story' : 'stories'} in ${category} ${categoryItems.length === 1 ? 'indicates' : 'indicate'} continued growth and innovation.`,
      impact: categoryItems.some(item => item.importance === 'high') ? 'High' : 'Medium',
      items: categoryItems.length
    });
  });
  
  return insights;
};

/**
 * Generate trending topics
 * @param {Array} newsItems - News items
 * @returns {Array} Trending topics
 */
const generateTrendingTopics = (newsItems) => {
  const topics = [];
  const categories = [...new Set(newsItems.map(item => item.category))];
  
  categories.forEach(category => {
    const categoryItems = newsItems.filter(item => item.category === category);
    topics.push({
      topic: category,
      mentions: categoryItems.length,
      trend: categoryItems.some(item => item.importance === 'high') ? 'rising' : 'stable',
      relevance: Math.floor(Math.random() * 40) + 60
    });
  });
  
  return topics.sort((a, b) => b.relevance - a.relevance);
};

/**
 * Calculate reading time
 * @param {Array} newsItems - News items
 * @param {string} frequency - Digest frequency
 * @returns {number} Reading time in minutes
 */
const calculateReadingTime = (newsItems, frequency) => {
  const baseTime = frequency === 'daily' ? 3 : frequency === 'weekly' ? 5 : 8;
  const itemTime = newsItems.length * 0.5;
  return Math.ceil(baseTime + itemTime);
};

/**
 * Process all subscriptions due for digest generation
 * @param {Object} db - Database connection
 * @returns {Promise<Array>} Generated digests
 */
const processSubscriptions = async (db) => {
  try {
    // Get all subscriptions due for digest generation
    const dueSubscriptions = await db.query(`
      SELECT s.*, u.email, u.full_name 
      FROM subscriptions s
      JOIN users u ON s.user_id = u.id
      WHERE s.enabled = true 
      AND s.next_digest_at <= CURRENT_TIMESTAMP
      ORDER BY s.next_digest_at
    `);
    
    console.log(`Processing ${dueSubscriptions.rows.length} subscription(s) for digest generation`);
    
    const processedDigests = [];
    
    for (const subscription of dueSubscriptions.rows) {
      try {
        // Generate digest
        const digest = await generateDigest(subscription.topic_id, subscription.frequency);
        
        // Save digest to database
        const savedDigest = await db.query(`
          INSERT INTO digests (
            subscription_id, user_id, topic_id, topic_name, frequency,
            ai_summary, key_insights, trending_topics, news_items, reading_time
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING *
        `, [
          subscription.id,
          subscription.user_id,
          digest.topicId,
          digest.topicName,
          digest.frequency,
          digest.aiSummary,
          JSON.stringify(digest.keyInsights),
          JSON.stringify(digest.trending),
          JSON.stringify(digest.newsItems),
          digest.readingTime
        ]);
        
        // Update subscription schedule
        await db.query('SELECT update_digest_schedule($1, $2)', [
          subscription.id,
          subscription.frequency
        ]);
        
        processedDigests.push({
          ...digest,
          id: savedDigest.rows[0].id,
          userEmail: subscription.email,
          userName: subscription.full_name
        });
        
        console.log(`Generated digest for ${subscription.full_name} - ${subscription.topic_name}`);
        
      } catch (error) {
        console.error(`Error processing subscription ${subscription.id}:`, error);
      }
    }
    
    return processedDigests;
    
  } catch (error) {
    console.error('Error processing subscriptions:', error);
    throw error;
  }
};

/**
 * Get digest recommendations for a user
 * @param {number} userId - User ID
 * @param {Array} userSubscriptions - User's current subscriptions
 * @returns {Promise<Array>} Recommendations
 */
const getDigestRecommendations = async (userId, userSubscriptions) => {
  const subscribedTopics = userSubscriptions.map(sub => sub.topicId);
  
  const recommendations = [
    { topicId: 'science', reason: 'Popular among users with similar interests', confidence: 85 },
    { topicId: 'health', reason: 'Trending in your network', confidence: 78 },
    { topicId: 'environment', reason: 'Related to your technology interests', confidence: 72 },
    { topicId: 'finance', reason: 'Complements your business interests', confidence: 68 },
    { topicId: 'education', reason: 'Based on your reading patterns', confidence: 65 }
  ];
  
  return recommendations.filter(rec => !subscribedTopics.includes(rec.topicId));
};

/**
 * Initialize digest scheduler
 * @param {Object} db - Database connection
 */
const initializeDigestScheduler = (db) => {
  console.log('Initializing digest scheduler...');
  
  // Run every hour to check for due digests
  cron.schedule('0 * * * *', async () => {
    console.log('Running digest generation check...');
    try {
      const processedDigests = await processSubscriptions(db);
      console.log(`Processed ${processedDigests.length} digests`);
      
      // Here you could send email notifications
      // await sendDigestNotifications(processedDigests);
      
    } catch (error) {
      console.error('Error in digest scheduler:', error);
    }
  });
  
  // Run daily at 9 AM for daily digests
  cron.schedule('0 9 * * *', async () => {
    console.log('Running daily digest generation...');
    try {
      await processSubscriptions(db);
    } catch (error) {
      console.error('Error in daily digest generation:', error);
    }
  });
  
  // Run weekly on Monday at 9 AM for weekly digests
  cron.schedule('0 9 * * 1', async () => {
    console.log('Running weekly digest generation...');
    try {
      await processSubscriptions(db);
    } catch (error) {
      console.error('Error in weekly digest generation:', error);
    }
  });
  
  // Run monthly on the 1st at 9 AM for monthly digests
  cron.schedule('0 9 1 * *', async () => {
    console.log('Running monthly digest generation...');
    try {
      await processSubscriptions(db);
    } catch (error) {
      console.error('Error in monthly digest generation:', error);
    }
  });
};

module.exports = {
  generateDigest,
  processSubscriptions,
  getDigestRecommendations,
  initializeDigestScheduler
};