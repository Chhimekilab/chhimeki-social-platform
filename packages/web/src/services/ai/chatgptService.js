// ChatGPT API Service
// Integrates OpenAI's ChatGPT API for AI-powered features

import axios from 'axios';

// ChatGPT API Configuration
const CHATGPT_CONFIG = {
  baseURL: 'https://api.openai.com/v1',
  apiKey: process.env.REACT_APP_CHATGPT_API_KEY || 'your-chatgpt-api-key-here',
  model: 'gpt-3.5-turbo',
  maxTokens: 1000,
  temperature: 0.7
};

// Cache for ChatGPT responses
let chatGPTCache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Make a ChatGPT API request with caching
 */
const makeChatGPTRequest = async (prompt, options = {}) => {
  const cacheKey = `chatgpt_${prompt}_${JSON.stringify(options)}`;
  
  // Check cache first
  const cached = chatGPTCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`🤖 Using cached ChatGPT response for: ${prompt.substring(0, 50)}...`);
    return cached.data;
  }
  
  try {
    console.log(`🤖 Making ChatGPT request for: ${prompt.substring(0, 50)}...`);
    
    const response = await axios.post(
      `${CHATGPT_CONFIG.baseURL}/chat/completions`,
      {
        model: options.model || CHATGPT_CONFIG.model,
        messages: [
          {
            role: 'system',
            content: options.systemPrompt || 'You are a helpful AI assistant for the Chhimeki social platform. Provide engaging, informative, and friendly responses.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: options.maxTokens || CHATGPT_CONFIG.maxTokens,
        temperature: options.temperature || CHATGPT_CONFIG.temperature
      },
      {
        headers: {
          'Authorization': `Bearer ${CHATGPT_CONFIG.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const result = {
      content: response.data.choices[0].message.content,
      usage: response.data.usage,
      model: response.data.model
    };
    
    // Cache the result
    chatGPTCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });
    
    return result;
  } catch (error) {
    console.error('❌ ChatGPT API request failed:', error);
    throw error;
  }
};

/**
 * Generate AI content for posts
 */
export const generatePostContent = async (topic, style = 'informative') => {
  const prompts = {
    informative: `Write an engaging social media post about "${topic}". Make it informative, interesting, and encourage discussion. Keep it under 280 characters.`,
    casual: `Write a casual, friendly social media post about "${topic}". Make it conversational and relatable. Keep it under 280 characters.`,
    professional: `Write a professional social media post about "${topic}". Make it authoritative and well-researched. Keep it under 280 characters.`,
    creative: `Write a creative and imaginative social media post about "${topic}". Make it unique and thought-provoking. Keep it under 280 characters.`
  };
  
  const prompt = prompts[style] || prompts.informative;
  
  try {
    const result = await makeChatGPTRequest(prompt, {
      systemPrompt: 'You are a social media content creator. Write engaging, authentic posts that encourage interaction and discussion.',
      temperature: 0.8
    });
    
    return {
      content: result.content,
      style,
      topic,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating post content:', error);
    return {
      content: `Interesting topic: ${topic}! What are your thoughts on this? 🤔`,
      style: 'fallback',
      topic,
      generatedAt: new Date().toISOString()
    };
  }
};

/**
 * Generate AI responses to comments
 */
export const generateCommentResponse = async (comment, context = '') => {
  const prompt = `A user commented: "${comment}" ${context ? `Context: ${context}` : ''}. Generate a helpful, friendly, and engaging response that encourages further discussion. Keep it conversational and under 150 characters.`;
  
  try {
    const result = await makeChatGPTRequest(prompt, {
      systemPrompt: 'You are a community manager. Respond to comments in a friendly, helpful way that encourages engagement and discussion.',
      temperature: 0.7
    });
    
    return {
      response: result.content,
      originalComment: comment,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating comment response:', error);
    return {
      response: 'Thanks for sharing your thoughts! What do others think about this? 💭',
      originalComment: comment,
      generatedAt: new Date().toISOString()
    };
  }
};

/**
 * Generate AI content variations
 */
export const generateContentVariations = async (topic, count = 3) => {
  const prompt = `Generate ${count} different social media post variations about "${topic}". Each should be unique in style and approach. Make them engaging and under 280 characters each. Format as a numbered list.`;
  
  try {
    const result = await makeChatGPTRequest(prompt, {
      systemPrompt: 'You are a creative content strategist. Generate diverse, engaging social media content variations.',
      temperature: 0.9
    });
    
    // Parse the numbered list response
    const variations = result.content
      .split('\n')
      .filter(line => line.trim() && /^\d+\./.test(line))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .slice(0, count);
    
    return variations.map((variation, index) => ({
      id: `variation_${index + 1}`,
      content: variation,
      style: `variation_${index + 1}`,
      topic
    }));
  } catch (error) {
    console.error('Error generating content variations:', error);
    return [
      {
        id: 'variation_1',
        content: `Fascinating topic: ${topic}! What's your take on this? 🤔`,
        style: 'variation_1',
        topic
      },
      {
        id: 'variation_2',
        content: `Interesting perspective on ${topic}. Anyone else have thoughts? 💭`,
        style: 'variation_2',
        topic
      },
      {
        id: 'variation_3',
        content: `Great discussion about ${topic}! Let's hear more opinions! 🗣️`,
        style: 'variation_3',
        topic
      }
    ];
  }
};

/**
 * Analyze content sentiment and suggest improvements
 */
export const analyzeContent = async (content, type = 'post') => {
  const prompt = `Analyze this ${type}: "${content}". Provide:
1. Sentiment (positive/neutral/negative)
2. Engagement potential (1-10)
3. One suggestion for improvement
4. Recommended hashtags (max 3)
Keep the analysis concise and constructive.`;

  try {
    const result = await makeChatGPTRequest(prompt, {
      systemPrompt: 'You are a social media analytics expert. Provide constructive feedback and suggestions for content improvement.',
      temperature: 0.3
    });
    
    // Parse the analysis
    const analysis = result.content;
    
    return {
      content,
      analysis,
      type,
      analyzedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error analyzing content:', error);
    return {
      content,
      analysis: 'Content analysis temporarily unavailable. Your content looks great! 👍',
      type,
      analyzedAt: new Date().toISOString()
    };
  }
};

/**
 * Generate trending topic insights
 */
export const generateTopicInsights = async (topic, context = '') => {
  const prompt = `Provide insights about the trending topic: "${topic}" ${context ? `Context: ${context}` : ''}. Include:
1. Why it's trending
2. Key points of discussion
3. Different perspectives
4. Potential impact
Keep it informative and engaging.`;

  try {
    const result = await makeChatGPTRequest(prompt, {
      systemPrompt: 'You are a trend analyst. Provide insightful analysis of trending topics with balanced perspectives.',
      temperature: 0.6
    });
    
    return {
      topic,
      insights: result.content,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating topic insights:', error);
    return {
      topic,
      insights: `${topic} is generating a lot of discussion! What are your thoughts on this trending topic? 🤔`,
      generatedAt: new Date().toISOString()
    };
  }
};

/**
 * Generate personalized recommendations
 */
export const generateRecommendations = async (userInterests, userActivity) => {
  const prompt = `Based on user interests: ${userInterests.join(', ')} and recent activity: ${userActivity}, generate personalized recommendations for:
1. Topics to explore
2. People to follow
3. Content to engage with
4. Communities to join
Make recommendations specific and relevant.`;

  try {
    const result = await makeChatGPTRequest(prompt, {
      systemPrompt: 'You are a personal recommendation engine. Provide relevant, personalized suggestions based on user preferences and behavior.',
      temperature: 0.7
    });
    
    return {
      recommendations: result.content,
      basedOn: { interests: userInterests, activity: userActivity },
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return {
      recommendations: 'Explore trending topics and connect with like-minded people! 🌟',
      basedOn: { interests: userInterests, activity: userActivity },
      generatedAt: new Date().toISOString()
    };
  }
};

/**
 * Generate conversation starters
 */
export const generateConversationStarters = async (topic, audience = 'general') => {
  const prompt = `Generate 3 engaging conversation starters about "${topic}" for a ${audience} audience. Make them thought-provoking and encourage discussion.`;

  try {
    const result = await makeChatGPTRequest(prompt, {
      systemPrompt: 'You are a conversation facilitator. Create engaging questions that spark meaningful discussions.',
      temperature: 0.8
    });
    
    // Parse the conversation starters
    const starters = result.content
      .split('\n')
      .filter(line => line.trim() && (line.includes('?') || line.includes('🤔')))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .slice(0, 3);
    
    return starters.map((starter, index) => ({
      id: `starter_${index + 1}`,
      question: starter,
      topic,
      audience
    }));
  } catch (error) {
    console.error('Error generating conversation starters:', error);
    return [
      {
        id: 'starter_1',
        question: `What's your take on ${topic}? 🤔`,
        topic,
        audience
      },
      {
        id: 'starter_2',
        question: `How has ${topic} impacted your life? 💭`,
        topic,
        audience
      },
      {
        id: 'starter_3',
        question: `What's the most interesting aspect of ${topic} to you? 🎯`,
        topic,
        audience
      }
    ];
  }
};

/**
 * Generate hashtag suggestions
 */
export const generateHashtags = async (content, topic = '') => {
  const prompt = `Suggest relevant hashtags for this content: "${content}" ${topic ? `Topic: ${topic}` : ''}. Provide 5-8 hashtags that are relevant, trending, and will increase visibility.`;

  try {
    const result = await makeChatGPTRequest(prompt, {
      systemPrompt: 'You are a hashtag strategist. Suggest relevant, trending hashtags that will increase content visibility and engagement.',
      temperature: 0.5
    });
    
    // Extract hashtags from response
    const hashtags = result.content
      .match(/#\w+/g)
      ?.map(tag => tag.slice(1)) || [];
    
    return {
      hashtags: hashtags.slice(0, 8),
      content,
      topic,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating hashtags:', error);
    return {
      hashtags: ['social', 'community', 'discussion'],
      content,
      topic,
      generatedAt: new Date().toISOString()
    };
  }
};

/**
 * Clear ChatGPT cache
 */
export const clearChatGPTCache = () => {
  chatGPTCache.clear();
  console.log('🗑️ Cleared ChatGPT cache');
};

/**
 * Get ChatGPT usage statistics
 */
export const getChatGPTStats = () => {
  const cacheSize = chatGPTCache.size;
  const cacheEntries = Array.from(chatGPTCache.entries());
  const recentRequests = cacheEntries
    .filter(([key, value]) => Date.now() - value.timestamp < 60 * 60 * 1000) // Last hour
    .length;
  
  return {
    cacheSize,
    recentRequests,
    cacheDuration: CACHE_DURATION / (1000 * 60), // in minutes
    isConfigured: !!CHATGPT_CONFIG.apiKey
  };
};

// Export all functions
export default {
  generatePostContent,
  generateCommentResponse,
  generateContentVariations,
  analyzeContent,
  generateTopicInsights,
  generateRecommendations,
  generateConversationStarters,
  generateHashtags,
  clearChatGPTCache,
  getChatGPTStats,
  makeChatGPTRequest
}; 