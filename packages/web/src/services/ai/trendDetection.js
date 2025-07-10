import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Mock trending topics data
const MOCK_TRENDING_TOPICS = [
  {
    topic: "AI Revolution in Healthcare",
    description: "Artificial intelligence is transforming medical diagnosis and treatment, with new AI tools helping doctors detect diseases earlier and more accurately.",
    source: "newsapi",
    trend_score: 95,
    engagement_score: 87,
    keywords: ["AI", "healthcare", "medical", "diagnosis", "technology"],
    category: "Technology"
  },
  {
    topic: "Sustainable Energy Breakthrough",
    description: "Scientists have developed a new solar panel technology that's 40% more efficient, promising to revolutionize renewable energy.",
    source: "newsapi", 
    trend_score: 89,
    engagement_score: 92,
    keywords: ["solar", "renewable", "energy", "sustainability", "climate"],
    category: "Environment"
  },
  {
    topic: "Remote Work Evolution",
    description: "Companies are adopting hybrid work models permanently, changing how we think about office spaces and work-life balance.",
    source: "google_trends",
    trend_score: 78,
    engagement_score: 85,
    keywords: ["remote work", "hybrid", "workplace", "productivity", "future"],
    category: "Business"
  },
  {
    topic: "Space Exploration Milestone",
    description: "NASA announces successful Mars mission results, bringing us closer to understanding potential life on other planets.",
    source: "newsapi",
    trend_score: 93,
    engagement_score: 88,
    keywords: ["space", "Mars", "NASA", "exploration", "science"],
    category: "Science"
  },
  {
    topic: "Cryptocurrency Market Surge",
    description: "Digital currencies see massive adoption as major corporations begin accepting crypto payments worldwide.",
    source: "google_trends",
    trend_score: 82,
    engagement_score: 90,
    keywords: ["cryptocurrency", "bitcoin", "blockchain", "digital", "finance"],
    category: "Finance"
  }
];

const MOCK_NEWS_ARTICLES = [
  {
    title: "AI Breakthrough: New Algorithm Predicts Disease 10 Years Early",
    description: "Researchers have developed an AI system that can predict the onset of diseases up to 10 years before symptoms appear.",
    url: "https://placeholder-news.com/ai-disease-prediction",
    publishedAt: new Date().toISOString(),
    source: { name: "Tech Health Today" }
  },
  {
    title: "Solar Panel Efficiency Reaches Record High of 47%",
    description: "New perovskite-silicon tandem solar cells achieve unprecedented efficiency levels in laboratory tests.",
    url: "https://placeholder-news.com/solar-efficiency-record",
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    source: { name: "Green Energy News" }
  },
  {
    title: "Major Tech Companies Announce Permanent Remote Work",
    description: "Google, Microsoft, and other tech giants make remote work permanent for majority of employees.",
    url: "https://placeholder-news.com/remote-work-permanent",
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    source: { name: "Business Tech Weekly" }
  }
];

/**
 * Fetch trending news from NewsAPI (using placeholder data)
 */
export const fetchTrendingNews = async () => {
  try {
    console.log('🔍 Fetching trending news from NewsAPI...');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, this would be:
    // const response = await axios.get(`https://newsapi.org/v2/top-headlines`, {
    //   params: {
    //     country: 'us',
    //     pageSize: 20,
    //     apiKey: process.env.NEWSAPI_KEY
    //   }
    // });
    
    // Return mock data for now
    return {
      status: 'ok',
      totalResults: MOCK_NEWS_ARTICLES.length,
      articles: MOCK_NEWS_ARTICLES
    };
  } catch (error) {
    console.error('Error fetching trending news:', error);
    return { status: 'error', articles: [] };
  }
};

/**
 * Fetch trending topics from Google Trends (using placeholder data)
 */
export const fetchGoogleTrends = async () => {
  try {
    console.log('📈 Fetching Google Trends data...');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In production, this would use Google Trends API
    const mockTrends = [
      { query: "AI healthcare", value: 100 },
      { query: "solar energy", value: 85 },
      { query: "remote work", value: 70 },
      { query: "space exploration", value: 90 },
      { query: "cryptocurrency", value: 75 }
    ];
    
    return {
      status: 'success',
      trends: mockTrends
    };
  } catch (error) {
    console.error('Error fetching Google Trends:', error);
    return { status: 'error', trends: [] };
  }
};

/**
 * Extract trending topics from news articles
 */
export const extractTrendingTopics = (articles) => {
  if (!articles || articles.length === 0) return [];
  
  return articles.map((article, index) => {
    // Simple keyword extraction (in production, use NLP)
    const keywords = extractKeywords(article.title + ' ' + article.description);
    
    return {
      id: uuidv4(),
      topic: article.title,
      description: article.description,
      source: 'newsapi',
      trend_score: Math.floor(Math.random() * 40) + 60, // 60-100
      engagement_score: Math.floor(Math.random() * 30) + 70, // 70-100
      keywords: keywords,
      category: categorizeTopic(article.title),
      url: article.url,
      publishedAt: article.publishedAt,
      sourceName: article.source?.name
    };
  });
};

/**
 * Simple keyword extraction (placeholder for real NLP)
 */
const extractKeywords = (text) => {
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(' ')
    .filter(word => word.length > 3 && !commonWords.includes(word))
    .slice(0, 5);
};

/**
 * Categorize topic based on keywords (placeholder logic)
 */
const categorizeTopic = (title) => {
  const techKeywords = ['ai', 'artificial intelligence', 'tech', 'digital', 'cyber', 'algorithm'];
  const healthKeywords = ['health', 'medical', 'disease', 'treatment', 'medicine'];
  const businessKeywords = ['business', 'company', 'market', 'economy', 'finance'];
  const scienceKeywords = ['science', 'research', 'study', 'discovery', 'space'];
  const environmentKeywords = ['climate', 'environment', 'green', 'sustainable', 'energy'];
  
  const lowerTitle = title.toLowerCase();
  
  if (techKeywords.some(keyword => lowerTitle.includes(keyword))) return 'Technology';
  if (healthKeywords.some(keyword => lowerTitle.includes(keyword))) return 'Health';
  if (businessKeywords.some(keyword => lowerTitle.includes(keyword))) return 'Business';
  if (scienceKeywords.some(keyword => lowerTitle.includes(keyword))) return 'Science';
  if (environmentKeywords.some(keyword => lowerTitle.includes(keyword))) return 'Environment';
  
  return 'General';
};

/**
 * Combine and rank trending topics from all sources
 */
export const getTrendingTopics = async (limit = 10) => {
  try {
    console.log('🔥 Getting trending topics...');
    
    // Get data from both sources
    const [newsData, trendsData] = await Promise.all([
      fetchTrendingNews(),
      fetchGoogleTrends()
    ]);
    
    // Extract topics from news
    const newsTopics = newsData.articles ? extractTrendingTopics(newsData.articles) : [];
    
    // Combine with mock trending topics for a richer dataset
    const allTopics = [...MOCK_TRENDING_TOPICS, ...newsTopics];
    
    // Sort by trend score and limit results
    const sortedTopics = allTopics
      .sort((a, b) => b.trend_score - a.trend_score)
      .slice(0, limit)
      .map(topic => ({
        ...topic,
        id: topic.id || uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true
      }));
    
    console.log(`✅ Found ${sortedTopics.length} trending topics`);
    return sortedTopics;
    
  } catch (error) {
    console.error('Error getting trending topics:', error);
    return MOCK_TRENDING_TOPICS.slice(0, limit);
  }
};

/**
 * Get a specific trending topic by ID or topic name
 */
export const getTrendingTopic = async (identifier) => {
  const topics = await getTrendingTopics(50);
  return topics.find(topic => 
    topic.id === identifier || 
    topic.topic.toLowerCase().includes(identifier.toLowerCase())
  );
};

/**
 * Analyze trending potential of a given topic
 */
export const analyzeTrendingPotential = (topic, description) => {
  // Simple scoring algorithm (in production, use ML)
  let score = 50;
  
  const highValueKeywords = ['ai', 'breakthrough', 'record', 'first', 'new', 'revolutionary'];
  const engagementKeywords = ['amazing', 'incredible', 'shocking', 'surprising', 'urgent'];
  
  const text = (topic + ' ' + description).toLowerCase();
  
  highValueKeywords.forEach(keyword => {
    if (text.includes(keyword)) score += 10;
  });
  
  engagementKeywords.forEach(keyword => {
    if (text.includes(keyword)) score += 5;
  });
  
  // Recent bias (newer topics get higher scores)
  score += Math.random() * 20;
  
  return Math.min(100, Math.max(0, score));
};

/**
 * Check if topic is suitable for AI content generation
 */
export const isTopicSuitableForAI = (topic) => {
  const unsuitableKeywords = ['violence', 'explicit', 'controversial', 'political debate'];
  const topicText = topic.topic + ' ' + topic.description;
  
  return !unsuitableKeywords.some(keyword => 
    topicText.toLowerCase().includes(keyword)
  );
};

export default {
  fetchTrendingNews,
  fetchGoogleTrends,
  extractTrendingTopics,
  getTrendingTopics,
  getTrendingTopic,
  analyzeTrendingPotential,
  isTopicSuitableForAI
};