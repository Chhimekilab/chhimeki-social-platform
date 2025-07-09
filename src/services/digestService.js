/**
 * Digest Service
 * Handles AI-generated digest creation and subscription management
 */

// Mock news data for different topics
const mockNewsData = {
  technology: [
    {
      id: 1,
      title: "AI Revolution in Healthcare: New Diagnostic Tools Show 95% Accuracy",
      summary: "Revolutionary AI diagnostic tools are being deployed in hospitals worldwide, showing unprecedented accuracy in early disease detection.",
      source: "TechCrunch",
      publishedAt: "2024-01-15T09:00:00Z",
      category: "AI & Healthcare",
      importance: "high"
    },
    {
      id: 2,
      title: "Quantum Computing Breakthrough: IBM Announces 1000-Qubit Processor",
      summary: "IBM's latest quantum processor marks a significant milestone in quantum computing, promising to solve complex problems previously thought impossible.",
      source: "MIT Technology Review",
      publishedAt: "2024-01-15T08:30:00Z",
      category: "Quantum Computing",
      importance: "high"
    },
    {
      id: 3,
      title: "Meta's New VR Platform Gains 10 Million Users in First Week",
      summary: "Meta's latest virtual reality platform has seen explosive growth, attracting millions of users seeking immersive digital experiences.",
      source: "The Verge",
      publishedAt: "2024-01-15T07:15:00Z",
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
      publishedAt: "2024-01-15T10:00:00Z",
      category: "Climate Policy",
      importance: "high"
    },
    {
      id: 2,
      title: "Digital Privacy Bill Passes Senate with Bipartisan Support",
      summary: "A comprehensive digital privacy protection bill has gained broad support, promising enhanced user rights and data protection.",
      source: "Associated Press",
      publishedAt: "2024-01-15T09:45:00Z",
      category: "Digital Rights",
      importance: "high"
    },
    {
      id: 3,
      title: "International Trade Negotiations Show Promise for Tech Sector",
      summary: "Recent trade talks have focused on reducing barriers for technology companies, potentially boosting global innovation.",
      source: "Financial Times",
      publishedAt: "2024-01-15T08:20:00Z",
      category: "Trade Policy",
      importance: "medium"
    }
  ],
  
  business: [
    {
      id: 1,
      title: "Electric Vehicle Market Surpasses $500 Billion Milestone",
      summary: "The global electric vehicle market has reached a new valuation record, driven by increased consumer adoption and government incentives.",
      source: "Bloomberg",
      publishedAt: "2024-01-15T11:00:00Z",
      category: "Automotive",
      importance: "high"
    },
    {
      id: 2,
      title: "Cryptocurrency Regulations Provide Market Stability",
      summary: "New regulatory frameworks for cryptocurrencies are bringing stability to the market, attracting institutional investors.",
      source: "Wall Street Journal",
      publishedAt: "2024-01-15T10:30:00Z",
      category: "Cryptocurrency",
      importance: "medium"
    },
    {
      id: 3,
      title: "Remote Work Trends Reshape Commercial Real Estate",
      summary: "The continued shift toward remote work is fundamentally changing commercial real estate demand and pricing structures.",
      source: "Forbes",
      publishedAt: "2024-01-15T09:15:00Z",
      category: "Real Estate",
      importance: "medium"
    }
  ],
  
  science: [
    {
      id: 1,
      title: "NASA's James Webb Telescope Discovers Potentially Habitable Exoplanet",
      summary: "The James Webb Space Telescope has identified an exoplanet with conditions that could potentially support life as we know it.",
      source: "NASA",
      publishedAt: "2024-01-15T12:00:00Z",
      category: "Space Science",
      importance: "high"
    },
    {
      id: 2,
      title: "Gene Therapy Trial Shows Promise for Treating Alzheimer's",
      summary: "A groundbreaking gene therapy trial has shown significant promise in slowing the progression of Alzheimer's disease.",
      source: "Nature",
      publishedAt: "2024-01-15T11:30:00Z",
      category: "Medical Research",
      importance: "high"
    },
    {
      id: 3,
      title: "Renewable Energy Efficiency Reaches Record High",
      summary: "Solar and wind energy technologies have achieved new efficiency records, making renewable energy more cost-effective than ever.",
      source: "Science Daily",
      publishedAt: "2024-01-15T10:45:00Z",
      category: "Energy",
      importance: "medium"
    }
  ],
  
  health: [
    {
      id: 1,
      title: "New Vaccine Shows 98% Effectiveness Against Seasonal Flu",
      summary: "A revolutionary new flu vaccine has demonstrated unprecedented effectiveness in clinical trials, potentially ending seasonal flu epidemics.",
      source: "Medical News Today",
      publishedAt: "2024-01-15T13:00:00Z",
      category: "Vaccines",
      importance: "high"
    },
    {
      id: 2,
      title: "Mental Health Apps Show Significant Impact on Patient Outcomes",
      summary: "Recent studies demonstrate that mental health mobile applications are providing measurable benefits for patients with anxiety and depression.",
      source: "Health Affairs",
      publishedAt: "2024-01-15T12:15:00Z",
      category: "Digital Health",
      importance: "medium"
    },
    {
      id: 3,
      title: "Personalized Medicine Breakthrough in Cancer Treatment",
      summary: "New personalized medicine approaches are showing remarkable success in treating various forms of cancer with targeted therapies.",
      source: "The Lancet",
      publishedAt: "2024-01-15T11:45:00Z",
      category: "Cancer Research",
      importance: "high"
    }
  ]
};

// Add mock data for remaining topics
const additionalTopics = ['environment', 'sports', 'entertainment', 'finance', 'education', 'travel', 'food'];

additionalTopics.forEach(topic => {
  mockNewsData[topic] = [
    {
      id: 1,
      title: `Breaking: Major ${topic.charAt(0).toUpperCase() + topic.slice(1)} Development`,
      summary: `Significant developments in the ${topic} sector are reshaping industry standards and consumer expectations.`,
      source: "Industry News",
      publishedAt: "2024-01-15T10:00:00Z",
      category: topic.charAt(0).toUpperCase() + topic.slice(1),
      importance: "medium"
    },
    {
      id: 2,
      title: `Innovation in ${topic.charAt(0).toUpperCase() + topic.slice(1)}: New Trends Emerge`,
      summary: `Emerging trends in ${topic} are creating new opportunities and challenges for industry professionals.`,
      source: "Sector Report",
      publishedAt: "2024-01-15T09:30:00Z",
      category: topic.charAt(0).toUpperCase() + topic.slice(1),
      importance: "low"
    }
  ];
});

/**
 * Generate AI digest for a specific topic
 * @param {string} topicId - The topic identifier
 * @param {string} frequency - digest frequency (daily, weekly, monthly)
 * @returns {Object} Generated digest
 */
export const generateDigest = async (topicId, frequency = 'weekly') => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newsItems = mockNewsData[topicId] || [];
  const topicName = topicId.charAt(0).toUpperCase() + topicId.slice(1);
  
  // Generate AI summary based on frequency
  const aiSummary = generateAISummary(newsItems, frequency, topicName);
  
  return {
    id: `digest_${topicId}_${Date.now()}`,
    topicId,
    topicName,
    frequency,
    generatedAt: new Date().toISOString(),
    aiSummary,
    newsItems: newsItems.slice(0, frequency === 'daily' ? 3 : frequency === 'weekly' ? 5 : 10),
    keyInsights: generateKeyInsights(newsItems, topicName),
    trending: generateTrendingTopics(newsItems),
    readingTime: calculateReadingTime(newsItems, frequency)
  };
};

/**
 * Generate AI summary based on news items
 * @param {Array} newsItems - Array of news items
 * @param {string} frequency - digest frequency
 * @param {string} topicName - Topic name
 * @returns {string} AI-generated summary
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
  
  // Add AI-generated insights
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
 * Generate key insights from news items
 * @param {Array} newsItems - Array of news items
 * @param {string} topicName - Topic name
 * @returns {Array} Array of key insights
 */
const generateKeyInsights = (newsItems, topicName) => {
  const insights = [];
  
  // Generate insights based on news categories
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
 * Generate trending topics from news items
 * @param {Array} newsItems - Array of news items
 * @returns {Array} Array of trending topics
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
      relevance: Math.floor(Math.random() * 40) + 60 // 60-100% relevance
    });
  });
  
  return topics.sort((a, b) => b.relevance - a.relevance);
};

/**
 * Calculate estimated reading time
 * @param {Array} newsItems - Array of news items
 * @param {string} frequency - digest frequency
 * @returns {number} Reading time in minutes
 */
const calculateReadingTime = (newsItems, frequency) => {
  const baseTime = frequency === 'daily' ? 3 : frequency === 'weekly' ? 5 : 8;
  const itemTime = newsItems.length * 0.5;
  return Math.ceil(baseTime + itemTime);
};

/**
 * Get user's digest history
 * @param {string} userId - User identifier
 * @returns {Array} Array of past digests
 */
export const getDigestHistory = async (userId) => {
  // Mock digest history
  return [
    {
      id: 'digest_technology_1',
      topicId: 'technology',
      topicName: 'Technology',
      frequency: 'daily',
      generatedAt: '2024-01-15T10:00:00Z',
      readingTime: 4,
      itemCount: 3
    },
    {
      id: 'digest_business_1',
      topicId: 'business',
      topicName: 'Business',
      frequency: 'weekly',
      generatedAt: '2024-01-10T09:00:00Z',
      readingTime: 6,
      itemCount: 5
    }
  ];
};

/**
 * Process subscriptions and generate digests
 * @param {Array} subscriptions - User subscriptions
 * @returns {Array} Array of generated digests
 */
export const processSubscriptions = async (subscriptions) => {
  const digests = [];
  
  for (const subscription of subscriptions) {
    if (subscription.enabled && shouldGenerateDigest(subscription)) {
      const digest = await generateDigest(subscription.topicId, subscription.frequency);
      digests.push(digest);
    }
  }
  
  return digests;
};

/**
 * Check if digest should be generated based on subscription timing
 * @param {Object} subscription - Subscription object
 * @returns {boolean} Whether to generate digest
 */
const shouldGenerateDigest = (subscription) => {
  const now = new Date();
  const nextDigest = new Date(subscription.nextDigest);
  
  return now >= nextDigest;
};

/**
 * Get personalized digest recommendations
 * @param {string} userId - User identifier
 * @param {Array} userSubscriptions - User's current subscriptions
 * @returns {Array} Recommended topics
 */
export const getDigestRecommendations = async (userId, userSubscriptions) => {
  const subscribedTopics = userSubscriptions.map(sub => sub.topicId);
  
  // Mock recommendations based on user behavior
  const recommendations = [
    { topicId: 'science', reason: 'Popular among users with similar interests', confidence: 85 },
    { topicId: 'health', reason: 'Trending in your network', confidence: 78 },
    { topicId: 'environment', reason: 'Related to your technology interests', confidence: 72 }
  ];
  
  return recommendations.filter(rec => !subscribedTopics.includes(rec.topicId));
};

export default {
  generateDigest,
  getDigestHistory,
  processSubscriptions,
  getDigestRecommendations
};