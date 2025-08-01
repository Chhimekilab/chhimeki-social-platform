import React, { useState } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  Hash, 
  TrendingUp, 
  RefreshCw, 
  Copy, 
  Check,
  Lightbulb,
  Users,
  Target,
  Zap
} from 'lucide-react';
import chatGPTService from '../../services/ai/chatgptService';

const AIContentGenerator = () => {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('informative');
  const [generatedContent, setGeneratedContent] = useState(null);
  const [variations, setVariations] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const contentStyles = [
    { id: 'informative', name: 'Informative', icon: <Target className="w-4 h-4" />, color: 'bg-blue-500' },
    { id: 'casual', name: 'Casual', icon: <Users className="w-4 h-4" />, color: 'bg-green-500' },
    { id: 'professional', name: 'Professional', icon: <TrendingUp className="w-4 h-4" />, color: 'bg-purple-500' },
    { id: 'creative', name: 'Creative', icon: <Sparkles className="w-4 h-4" />, color: 'bg-pink-500' }
  ];

  const generateContent = async () => {
    if (!topic.trim()) return;
    
    setLoading(true);
    setGeneratedContent(null);
    setVariations([]);
    setHashtags([]);
    setInsights(null);
    
    try {
      // Generate main content
      const content = await chatGPTService.generatePostContent(topic, style);
      setGeneratedContent(content);
      
      // Generate variations
      const contentVariations = await chatGPTService.generateContentVariations(topic, 3);
      setVariations(contentVariations);
      
      // Generate hashtags
      const hashtagData = await chatGPTService.generateHashtags(content.content, topic);
      setHashtags(hashtagData.hashtags);
      
      // Generate insights
      const topicInsights = await chatGPTService.generateTopicInsights(topic);
      setInsights(topicInsights);
      
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const generateConversationStarters = async () => {
    if (!topic.trim()) return;
    
    setLoading(true);
    try {
      const starters = await chatGPTService.generateConversationStarters(topic);
      setVariations(starters.map(starter => ({
        id: starter.id,
        content: starter.question,
        style: 'conversation_starter',
        topic: starter.topic
      })));
    } catch (error) {
      console.error('Error generating conversation starters:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeContent = async () => {
    if (!generatedContent?.content) return;
    
    setLoading(true);
    try {
      const analysis = await chatGPTService.analyzeContent(generatedContent.content, 'post');
      setInsights(analysis);
    } catch (error) {
      console.error('Error analyzing content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Content Generator</h3>
            <p className="text-sm text-gray-600">Create engaging posts with ChatGPT</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setTopic('');
              setGeneratedContent(null);
              setVariations([]);
              setHashtags([]);
              setInsights(null);
            }}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            title="Clear all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Topic Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What would you like to post about?
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., AI in healthcare, remote work tips, climate change..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          onKeyPress={(e) => e.key === 'Enter' && generateContent()}
        />
      </div>

      {/* Style Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Choose your content style:
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {contentStyles.map((contentStyle) => (
            <button
              key={contentStyle.id}
              onClick={() => setStyle(contentStyle.id)}
              className={`flex items-center space-x-2 p-3 rounded-lg border transition-all ${
                style === contentStyle.id
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              {contentStyle.icon}
              <span className="text-sm font-medium">{contentStyle.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <div className="mb-6">
        <button
          onClick={generateContent}
          disabled={!topic.trim() || loading}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
            !topic.trim() || loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Generating...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Content</span>
            </div>
          )}
        </button>
      </div>

      {/* Generated Content */}
      {generatedContent && (
        <div className="space-y-6">
          {/* Main Content */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>Generated Post</span>
              </h4>
              <button
                onClick={() => copyToClipboard(generatedContent.content)}
                className="flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-700"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-gray-800 leading-relaxed">{generatedContent.content}</p>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-purple-200">
              <span className="text-xs text-gray-500">
                Style: {contentStyles.find(s => s.id === generatedContent.style)?.name}
              </span>
              <span className="text-xs text-gray-500">
                {generatedContent.content.length} characters
              </span>
            </div>
          </div>

          {/* Hashtags */}
          {hashtags.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                <Hash className="w-4 h-4" />
                <span>Suggested Hashtags</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => copyToClipboard(`#${tag}`)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content Variations */}
          {variations.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4" />
                  <span>Content Variations</span>
                </h4>
                <button
                  onClick={generateConversationStarters}
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  Generate Questions
                </button>
              </div>
              <div className="space-y-3">
                {variations.map((variation, index) => (
                  <div key={variation.id} className="p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-start justify-between">
                      <p className="text-gray-800 flex-1">{variation.content}</p>
                      <button
                        onClick={() => copyToClipboard(variation.content)}
                        className="ml-2 p-1 text-gray-500 hover:text-gray-700"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insights */}
          {insights && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>AI Insights</span>
              </h4>
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-gray-800 text-sm leading-relaxed">
                  {insights.insights || insights.analysis}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={analyzeContent}
              className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              Analyze Content
            </button>
            <button
              onClick={generateConversationStarters}
              className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
            >
              Generate Questions
            </button>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">💡 Tips for Better Results</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Be specific about your topic for more relevant content</li>
          <li>• Try different styles to match your audience</li>
          <li>• Use the generated hashtags to increase visibility</li>
          <li>• Ask follow-up questions to encourage engagement</li>
        </ul>
      </div>
    </div>
  );
};

export default AIContentGenerator; 