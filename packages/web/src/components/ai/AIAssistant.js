import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  MessageCircle, 
  Lightbulb, 
  TrendingUp, 
  Users, 
  Hash, 
  RefreshCw,
  Send,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';
import chatGPTService from '../../services/ai/chatgptService';

const AIAssistant = ({ currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        type: 'ai',
        content: `Hello ${currentUser?.full_name || 'there'}! 👋 I'm your AI assistant. I can help you with content creation, trending topics, and personalized recommendations. What would you like to know?`,
        timestamp: new Date().toISOString()
      }
    ]);
  }, [currentUser]);

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      let aiResponse;

      // Handle different types of requests
      if (message.toLowerCase().includes('recommend') || message.toLowerCase().includes('suggestion')) {
        aiResponse = await generateRecommendations(message);
      } else if (message.toLowerCase().includes('trend') || message.toLowerCase().includes('popular')) {
        aiResponse = await generateTrendingInsights(message);
      } else if (message.toLowerCase().includes('hashtag') || message.toLowerCase().includes('tag')) {
        aiResponse = await generateHashtagSuggestions(message);
      } else if (message.toLowerCase().includes('content') || message.toLowerCase().includes('post')) {
        aiResponse = await generateContentHelp(message);
      } else {
        aiResponse = await generateGeneralResponse(message);
      }

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm having trouble connecting right now. Please try again in a moment! 🤖",
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async (message) => {
    const userInterests = currentUser?.interests || ['technology', 'social media'];
    const userActivity = 'recent posts and engagement';
    
    const result = await chatGPTService.generateRecommendations(userInterests, userActivity);
    return result.recommendations;
  };

  const generateTrendingInsights = async (message) => {
    // Extract topic from message
    const topic = message.replace(/.*trend.*|.*popular.*/gi, '').trim() || 'current trends';
    const result = await chatGPTService.generateTopicInsights(topic);
    return result.insights;
  };

  const generateHashtagSuggestions = async (message) => {
    const content = message.replace(/.*hashtag.*|.*tag.*/gi, '').trim() || 'social media content';
    const result = await chatGPTService.generateHashtags(content);
    return `Here are some hashtag suggestions: ${result.hashtags.map(tag => `#${tag}`).join(', ')}`;
  };

  const generateContentHelp = async (message) => {
    const topic = message.replace(/.*content.*|.*post.*/gi, '').trim() || 'social media';
    const result = await chatGPTService.generatePostContent(topic, 'informative');
    return `Here's a content idea: "${result.content}"\n\nWould you like me to generate more variations or help you with hashtags?`;
  };

  const generateGeneralResponse = async (message) => {
    const prompt = `User asked: "${message}". Provide a helpful, friendly response as an AI assistant for a social media platform. Keep it conversational and under 200 characters.`;
    
    try {
      const result = await chatGPTService.makeChatGPTRequest(prompt, {
        systemPrompt: 'You are a helpful AI assistant for a social media platform. Be friendly, informative, and encourage engagement.',
        temperature: 0.7
      });
      return result.content;
    } catch (error) {
      return "That's an interesting question! I'd be happy to help you with content creation, trending topics, or personalized recommendations. What specific area would you like to explore? 🤔";
    }
  };

  const generatePersonalizedRecommendations = async () => {
    setLoading(true);
    try {
      const userInterests = currentUser?.interests || ['technology', 'social media', 'community'];
      const userActivity = 'active social media user';
      
      const result = await chatGPTService.generateRecommendations(userInterests, userActivity);
      setRecommendations(result);
      setShowRecommendations(true);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      id: 'recommendations',
      title: 'Get Recommendations',
      icon: <Target className="w-4 h-4" />,
      action: generatePersonalizedRecommendations
    },
    {
      id: 'trending',
      title: 'Trending Topics',
      icon: <TrendingUp className="w-4 h-4" />,
      action: () => sendMessage('What are the current trending topics?')
    },
    {
      id: 'hashtags',
      title: 'Hashtag Help',
      icon: <Hash className="w-4 h-4" />,
      action: () => sendMessage('Help me find relevant hashtags for my posts')
    },
    {
      id: 'content',
      title: 'Content Ideas',
      icon: <Sparkles className="w-4 h-4" />,
      action: () => sendMessage('Give me some content ideas for social media')
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
            <p className="text-sm text-gray-600">Your personal AI helper</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setMessages([{
                id: 'welcome',
                type: 'ai',
                content: `Hello ${currentUser?.full_name || 'there'}! 👋 How can I help you today?`,
                timestamp: new Date().toISOString()
              }]);
              setShowRecommendations(false);
            }}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            title="Reset conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Actions:</h4>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={action.action}
              disabled={loading}
              className="flex items-center space-x-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm"
            >
              {action.icon}
              <span>{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="mb-6 h-64 overflow-y-auto space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recommendations Section */}
      {showRecommendations && recommendations && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
            <Lightbulb className="w-4 h-4" />
            <span>Personalized Recommendations</span>
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {recommendations.recommendations}
          </p>
        </div>
      )}

      {/* Input */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
          placeholder="Ask me anything..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
        <button
          onClick={() => sendMessage(inputMessage)}
          disabled={!inputMessage.trim() || loading}
          className={`p-3 rounded-lg transition-colors ${
            !inputMessage.trim() || loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Tips */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 What I can help with:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Content ideas and post suggestions</li>
          <li>• Trending topics and insights</li>
          <li>• Hashtag recommendations</li>
          <li>• Personalized recommendations</li>
        </ul>
      </div>
    </div>
  );
};

export default AIAssistant; 