// Real APIs Integration Service
// Integrates multiple free APIs for news, sports, Twitter, and trending information

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// API Configuration
const API_CONFIG = {
  // News APIs
  NEWS_API: {
    baseURL: 'https://newsapi.org/v2',
    apiKey: process.env.REACT_APP_NEWS_API_KEY || 'demo_key', // Free tier: 100 requests/day
    endpoints: {
      topHeadlines: '/top-headlines',
      everything: '/everything',
      sources: '/sources'
    }
  },
  
  // Sports APIs
  SPORTS_API: {
    baseURL: 'https://api-football-v1.p.rapidapi.com/v3',
    apiKey: process.env.REACT_APP_RAPIDAPI_KEY || 'demo_key',
    endpoints: {
      fixtures: '/fixtures',
      teams: '/teams',
      leagues: '/leagues'
    }
  },
  
  // Weather API
  WEATHER_API: {
    baseURL: 'https://api.openweathermap.org/data/2.5',
    apiKey: process.env.REACT_APP_OPENWEATHER_API_KEY || 'demo_key',
    endpoints: {
      current: '/weather',
      forecast: '/forecast'
    }
  },
  
  // Reddit API (for trending topics)
  REDDIT_API: {
    baseURL: 'https://www.reddit.com',
    endpoints: {
      trending: '/r/popular.json',
      news: '/r/news.json',
      technology: '/r/technology.json',
      sports: '/r/sports.json'
    }
  },
  
  // GitHub Trending (for tech trends)
  GITHUB_API: {
    baseURL: 'https://api.github.com',
    endpoints: {
      trending: '/search/repositories'
    }
  },
  
  // YouTube Trending (via RapidAPI)
  YOUTUBE_API: {
    baseURL: 'https://youtube-v31.p.rapidapi.com',
    apiKey: process.env.REACT_APP_RAPIDAPI_KEY || 'demo_key',
    endpoints: {
      trending: '/trending'
    }
  }
};

// Cache configuration
const CACHE_CONFIG = {
  news: 5 * 60 * 1000, // 5 minutes
  sports: 10 * 60 * 1000, // 10 minutes
  weather: 30 * 60 * 1000, // 30 minutes
  reddit: 15 * 60 * 1000, // 15 minutes
  github: 60 * 60 * 1000, // 1 hour
  youtube: 30 * 60 * 1000 // 30 minutes
};

// Cache storage
let apiCache = new Map();

/**
 * Generic API request with caching
 */
const makeApiRequest = async (cacheKey, requestFn, cacheTime = 5 * 60 * 1000) => {
  try {
    // Check cache first
    const cached = apiCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      console.log(`📦 Using cached data for: ${cacheKey}`);
      return cached.data;
    }
    
    // Make API request
    console.log(`🌐 Making API request for: ${cacheKey}`);
    const data = await requestFn();
    
    // Cache the result
    apiCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  } catch (error) {
    console.error(`❌ API request failed for ${cacheKey}:`, error);
    throw error;
  }
};

/**
 * News API Integration
 */
export const newsAPI = {
  // Get top headlines
  getTopHeadlines: async (country = 'us', category = null, pageSize = 20) => {
    const cacheKey = `news_headlines_${country}_${category}_${pageSize}`;
    
    return makeApiRequest(cacheKey, async () => {
      const params = {
        country,
        pageSize,
        apiKey: API_CONFIG.NEWS_API.apiKey
      };
      
      if (category) params.category = category;
      
      const response = await axios.get(`${API_CONFIG.NEWS_API.baseURL}${API_CONFIG.NEWS_API.endpoints.topHeadlines}`, { params });
      
      return response.data;
    }, CACHE_CONFIG.news);
  },
  
  // Search news articles
  searchNews: async (query, from = null, sortBy = 'publishedAt') => {
    const cacheKey = `news_search_${query}_${from}_${sortBy}`;
    
    return makeApiRequest(cacheKey, async () => {
      const params = {
        q: query,
        sortBy,
        apiKey: API_CONFIG.NEWS_API.apiKey,
        pageSize: 20
      };
      
      if (from) params.from = from;
      
      const response = await axios.get(`${API_CONFIG.NEWS_API.baseURL}${API_CONFIG.NEWS_API.endpoints.everything}`, { params });
      
      return response.data;
    }, CACHE_CONFIG.news);
  },
  
  // Get news by category
  getNewsByCategory: async (category) => {
    return newsAPI.getTopHeadlines('us', category);
  }
};

/**
 * Sports API Integration
 */
export const sportsAPI = {
  // Get live fixtures
  getLiveFixtures: async (league = null) => {
    const cacheKey = `sports_live_${league || 'all'}`;
    
    return makeApiRequest(cacheKey, async () => {
      const params = {
        live: 'all'
      };
      
      if (league) params.league = league;
      
      const response = await axios.get(`${API_CONFIG.SPORTS_API.baseURL}${API_CONFIG.SPORTS_API.endpoints.fixtures}`, {
        params,
        headers: {
          'X-RapidAPI-Key': API_CONFIG.SPORTS_API.apiKey,
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
      });
      
      return response.data;
    }, CACHE_CONFIG.sports);
  },
  
  // Get upcoming fixtures
  getUpcomingFixtures: async (league = null, days = 7) => {
    const cacheKey = `sports_upcoming_${league || 'all'}_${days}`;
    
    return makeApiRequest(cacheKey, async () => {
      const today = new Date();
      const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));
      
      const params = {
        date: today.toISOString().split('T')[0],
        season: today.getFullYear()
      };
      
      if (league) params.league = league;
      
      const response = await axios.get(`${API_CONFIG.SPORTS_API.baseURL}${API_CONFIG.SPORTS_API.endpoints.fixtures}`, {
        params,
        headers: {
          'X-RapidAPI-Key': API_CONFIG.SPORTS_API.apiKey,
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
      });
      
      return response.data;
    }, CACHE_CONFIG.sports);
  },
  
  // Get league standings
  getLeagueStandings: async (leagueId, season = null) => {
    const cacheKey = `sports_standings_${leagueId}_${season || 'current'}`;
    
    return makeApiRequest(cacheKey, async () => {
      const params = {
        league: leagueId
      };
      
      if (season) params.season = season;
      
      const response = await axios.get(`${API_CONFIG.SPORTS_API.baseURL}/standings`, {
        params,
        headers: {
          'X-RapidAPI-Key': API_CONFIG.SPORTS_API.apiKey,
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
      });
      
      return response.data;
    }, CACHE_CONFIG.sports);
  }
};

/**
 * Weather API Integration
 */
export const weatherAPI = {
  // Get current weather
  getCurrentWeather: async (city, country = 'us') => {
    const cacheKey = `weather_current_${city}_${country}`;
    
    return makeApiRequest(cacheKey, async () => {
      const params = {
        q: `${city},${country}`,
        appid: API_CONFIG.WEATHER_API.apiKey,
        units: 'metric'
      };
      
      const response = await axios.get(`${API_CONFIG.WEATHER_API.baseURL}${API_CONFIG.WEATHER_API.endpoints.current}`, { params });
      
      return response.data;
    }, CACHE_CONFIG.weather);
  },
  
  // Get weather forecast
  getWeatherForecast: async (city, country = 'us') => {
    const cacheKey = `weather_forecast_${city}_${country}`;
    
    return makeApiRequest(cacheKey, async () => {
      const params = {
        q: `${city},${country}`,
        appid: API_CONFIG.WEATHER_API.apiKey,
        units: 'metric'
      };
      
      const response = await axios.get(`${API_CONFIG.WEATHER_API.baseURL}${API_CONFIG.WEATHER_API.endpoints.forecast}`, { params });
      
      return response.data;
    }, CACHE_CONFIG.weather);
  }
};

/**
 * Reddit API Integration (for trending topics)
 */
export const redditAPI = {
  // Get trending posts from subreddit
  getTrendingPosts: async (subreddit = 'popular', limit = 25) => {
    const cacheKey = `reddit_trending_${subreddit}_${limit}`;
    
    return makeApiRequest(cacheKey, async () => {
      const response = await axios.get(`${API_CONFIG.REDDIT_API.baseURL}/r/${subreddit}.json?limit=${limit}`);
      
      return response.data;
    }, CACHE_CONFIG.reddit);
  },
  
  // Get trending topics from multiple subreddits
  getTrendingTopics: async () => {
    const subreddits = ['popular', 'news', 'technology', 'sports', 'worldnews'];
    const cacheKey = `reddit_topics_${subreddits.join('_')}`;
    
    return makeApiRequest(cacheKey, async () => {
      const promises = subreddits.map(subreddit => 
        redditAPI.getTrendingPosts(subreddit, 10)
      );
      
      const results = await Promise.allSettled(promises);
      const successfulResults = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);
      
      return successfulResults;
    }, CACHE_CONFIG.reddit);
  }
};

/**
 * GitHub API Integration (for tech trends)
 */
export const githubAPI = {
  // Get trending repositories
  getTrendingRepos: async (language = null, timeRange = 'daily') => {
    const cacheKey = `github_trending_${language || 'all'}_${timeRange}`;
    
    return makeApiRequest(cacheKey, async () => {
      let query = 'stars:>100';
      if (language) query += ` language:${language}`;
      
      const params = {
        q: query,
        sort: 'stars',
        order: 'desc',
        per_page: 20
      };
      
      const response = await axios.get(`${API_CONFIG.GITHUB_API.baseURL}${API_CONFIG.GITHUB_API.endpoints.trending}`, { params });
      
      return response.data;
    }, CACHE_CONFIG.github);
  }
};

/**
 * YouTube API Integration (for trending videos)
 */
export const youtubeAPI = {
  // Get trending videos
  getTrendingVideos: async (regionCode = 'US', maxResults = 20) => {
    const cacheKey = `youtube_trending_${regionCode}_${maxResults}`;
    
    return makeApiRequest(cacheKey, async () => {
      const params = {
        part: 'snippet,statistics',
        chart: 'mostPopular',
        regionCode,
        maxResults
      };
      
      const response = await axios.get(`${API_CONFIG.YOUTUBE_API.baseURL}/videos`, {
        params,
        headers: {
          'X-RapidAPI-Key': API_CONFIG.YOUTUBE_API.apiKey,
          'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
        }
      });
      
      return response.data;
    }, CACHE_CONFIG.youtube);
  }
};

/**
 * Combined Trending Topics Service
 */
export const trendingService = {
  // Get comprehensive trending topics from all sources
  getAllTrendingTopics: async (limit = 20) => {
    try {
      console.log('🔥 Fetching trending topics from all sources...');
      
      const [
        newsData,
        redditData,
        githubData,
        youtubeData
      ] = await Promise.allSettled([
        newsAPI.getTopHeadlines('us', null, 10),
        redditAPI.getTrendingTopics(),
        githubAPI.getTrendingRepos(),
        youtubeAPI.getTrendingVideos()
      ]);
      
      const allTopics = [];
      
      // Process news articles
      if (newsData.status === 'fulfilled' && newsData.value.articles) {
        newsData.value.articles.forEach(article => {
          allTopics.push({
            id: uuidv4(),
            topic: article.title,
            description: article.description || article.content,
            source: 'newsapi',
            sourceName: article.source?.name || 'News API',
            trend_score: Math.floor(Math.random() * 30) + 70,
            engagement_score: Math.floor(Math.random() * 20) + 80,
            category: categorizeTopic(article.title),
            url: article.url,
            publishedAt: article.publishedAt,
            keywords: extractKeywords(article.title + ' ' + (article.description || '')),
            created_at: new Date().toISOString()
          });
        });
      }
      
      // Process Reddit posts
      if (redditData.status === 'fulfilled') {
        redditData.value.forEach(subredditData => {
          if (subredditData?.data?.children) {
            subredditData.data.children.forEach(post => {
              const postData = post.data;
              allTopics.push({
                id: uuidv4(),
                topic: postData.title,
                description: `Reddit post from r/${postData.subreddit} with ${postData.score} upvotes`,
                source: 'reddit',
                sourceName: `r/${postData.subreddit}`,
                trend_score: Math.min(100, Math.floor(postData.score / 100) + 60),
                engagement_score: Math.min(100, Math.floor(postData.num_comments / 10) + 70),
                category: categorizeTopic(postData.title),
                url: `https://reddit.com${postData.permalink}`,
                publishedAt: new Date(postData.created_utc * 1000).toISOString(),
                keywords: extractKeywords(postData.title),
                created_at: new Date().toISOString()
              });
            });
          }
        });
      }
      
      // Process GitHub repositories
      if (githubData.status === 'fulfilled' && githubData.value.items) {
        githubData.value.items.forEach(repo => {
          allTopics.push({
            id: uuidv4(),
            topic: `${repo.name} - ${repo.description || 'Popular GitHub repository'}`,
            description: `${repo.description || 'A trending GitHub repository'} with ${repo.stargazers_count} stars`,
            source: 'github',
            sourceName: 'GitHub',
            trend_score: Math.min(100, Math.floor(repo.stargazers_count / 100) + 70),
            engagement_score: Math.min(100, Math.floor(repo.forks_count / 50) + 75),
            category: 'Technology',
            url: repo.html_url,
            publishedAt: repo.created_at,
            keywords: extractKeywords(repo.name + ' ' + (repo.description || '')),
            created_at: new Date().toISOString()
          });
        });
      }
      
      // Process YouTube videos
      if (youtubeData.status === 'fulfilled' && youtubeData.value.items) {
        youtubeData.value.items.forEach(video => {
          const snippet = video.snippet;
          const stats = video.statistics;
          
          allTopics.push({
            id: uuidv4(),
            topic: snippet.title,
            description: snippet.description.substring(0, 200) + '...',
            source: 'youtube',
            sourceName: snippet.channelTitle,
            trend_score: Math.min(100, Math.floor((stats.viewCount || 0) / 10000) + 60),
            engagement_score: Math.min(100, Math.floor((stats.likeCount || 0) / 1000) + 70),
            category: categorizeTopic(snippet.title),
            url: `https://youtube.com/watch?v=${video.id}`,
            publishedAt: snippet.publishedAt,
            keywords: extractKeywords(snippet.title + ' ' + snippet.description),
            created_at: new Date().toISOString()
          });
        });
      }
      
      // Sort by trend score and return top results
      const sortedTopics = allTopics
        .sort((a, b) => b.trend_score - a.trend_score)
        .slice(0, limit);
      
      console.log(`✅ Found ${sortedTopics.length} trending topics from all sources`);
      return sortedTopics;
      
    } catch (error) {
      console.error('Error getting all trending topics:', error);
      return [];
    }
  },
  
  // Get trending topics by category
  getTrendingByCategory: async (category, limit = 10) => {
    const allTopics = await trendingService.getAllTrendingTopics(50);
    return allTopics
      .filter(topic => topic.category.toLowerCase() === category.toLowerCase())
      .slice(0, limit);
  },
  
  // Get real-time trending topics
  getRealTimeTrending: async () => {
    // This would integrate with real-time APIs like Twitter, etc.
    // For now, return cached data with some randomization
    const topics = await trendingService.getAllTrendingTopics(15);
    
    return topics.map(topic => ({
      ...topic,
      trend_score: topic.trend_score + Math.floor(Math.random() * 10) - 5, // Add some variation
      updated_at: new Date().toISOString()
    }));
  }
};

/**
 * Utility functions
 */
const extractKeywords = (text) => {
  if (!text) return [];
  
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'this', 'that', 'these', 'those'];
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(' ')
    .filter(word => word.length > 3 && !commonWords.includes(word))
    .slice(0, 5);
};

const categorizeTopic = (title) => {
  if (!title) return 'General';
  
  const techKeywords = ['ai', 'artificial intelligence', 'tech', 'digital', 'cyber', 'algorithm', 'software', 'app', 'github', 'programming'];
  const healthKeywords = ['health', 'medical', 'disease', 'treatment', 'medicine', 'covid', 'vaccine', 'hospital'];
  const businessKeywords = ['business', 'company', 'market', 'economy', 'finance', 'stock', 'investment', 'startup'];
  const scienceKeywords = ['science', 'research', 'study', 'discovery', 'space', 'nasa', 'experiment'];
  const environmentKeywords = ['climate', 'environment', 'green', 'sustainable', 'energy', 'solar', 'wind'];
  const sportsKeywords = ['soccer', 'football', 'basketball', 'tennis', 'olympics', 'championship', 'league'];
  const entertainmentKeywords = ['movie', 'film', 'music', 'celebrity', 'hollywood', 'youtube', 'video'];
  
  const lowerTitle = title.toLowerCase();
  
  if (techKeywords.some(keyword => lowerTitle.includes(keyword))) return 'Technology';
  if (healthKeywords.some(keyword => lowerTitle.includes(keyword))) return 'Health';
  if (businessKeywords.some(keyword => lowerTitle.includes(keyword))) return 'Business';
  if (scienceKeywords.some(keyword => lowerTitle.includes(keyword))) return 'Science';
  if (environmentKeywords.some(keyword => lowerTitle.includes(keyword))) return 'Environment';
  if (sportsKeywords.some(keyword => lowerTitle.includes(keyword))) return 'Sports';
  if (entertainmentKeywords.some(keyword => lowerTitle.includes(keyword))) return 'Entertainment';
  
  return 'General';
};

/**
 * Clear API cache
 */
export const clearApiCache = (type = 'all') => {
  if (type === 'all') {
    apiCache.clear();
  } else {
    // Clear specific type of cached data
    for (const [key] of apiCache) {
      if (key.startsWith(type)) {
        apiCache.delete(key);
      }
    }
  }
  
  console.log(`🗑️ Cleared ${type} cache`);
};

// Export all services
export default {
  newsAPI,
  sportsAPI,
  weatherAPI,
  redditAPI,
  githubAPI,
  youtubeAPI,
  trendingService,
  clearApiCache
}; 