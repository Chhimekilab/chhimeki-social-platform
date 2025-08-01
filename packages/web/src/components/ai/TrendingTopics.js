import React, { useState, useEffect } from 'react';
import AIService from '../../services/ai';

const TrendingTopics = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadTrendingTopics();
    
    // Refresh every 5 minutes
    const interval = setInterval(loadTrendingTopics, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const loadTrendingTopics = async () => {
    try {
      const result = await AIService.getTrendingTopics(15);
      setTrends(result.trends);
      setLastUpdated(result.updated_at);
      setLoading(false);
    } catch (error) {
      console.error('Error loading trending topics:', error);
      setLoading(false);
    }
  };

  const generatePostFromTrend = async (trend) => {
    try {
      setGenerating(trend.id);
      
      const generatedPost = await AIService.generateContent(trend, 'post');
      
      // Show success message
      alert(`✅ AI Post Generated!\n\n"${generatedPost.content.substring(0, 100)}..."`);
      
      // Force refresh AI posts
      await AIService.forceGenerateContent();
      
    } catch (error) {
      console.error('Error generating post from trend:', error);
      alert('❌ Failed to generate AI post. Please try again.');
    } finally {
      setGenerating(null);
    }
  };

  const getTrendScoreColor = (score) => {
    if (score >= 90) return 'text-red-600 bg-red-100';
    if (score >= 80) return 'text-orange-600 bg-orange-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    if (score >= 60) return 'text-green-600 bg-green-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Technology': 'bg-blue-500',
      'Health': 'bg-green-500',
      'Business': 'bg-purple-500',
      'Science': 'bg-indigo-500',
      'Environment': 'bg-emerald-500',
      'Finance': 'bg-yellow-500',
      'General': 'bg-gray-500'
    };
    return colors[category] || colors['General'];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trending topics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <span className="text-3xl mr-2">📈</span>
            Trending Topics
          </h2>
          <p className="text-gray-600 mt-1">
            Real-time trending topics from news and social media
          </p>
        </div>
        <div className="text-right">
          <button
            onClick={loadTrendingTopics}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Refresh
          </button>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Never'}
          </p>
        </div>
      </div>

      {/* Trending Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trends.map((trend, index) => (
          <div key={trend.id || index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Trend Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">#{index + 1}</span>
                  <div>
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(trend.category)} text-white
                    `}>
                      {trend.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium ${getTrendScoreColor(trend.trend_score)}
                  `}>
                    {trend.trend_score}
                  </span>
                  <span className="text-xs text-gray-500">
                    {trend.source}
                  </span>
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 leading-tight">
                {trend.topic}
              </h3>
              
              <p className="text-sm text-gray-600 leading-relaxed">
                {trend.description}
              </p>
            </div>

            {/* Trend Details */}
            <div className="p-4">
              {/* Keywords */}
              {trend.keywords && trend.keywords.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Keywords:</p>
                  <div className="flex flex-wrap gap-1">
                    {trend.keywords.slice(0, 4).map((keyword, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {trend.trend_score}
                  </div>
                  <div className="text-xs text-gray-500">Trend Score</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {trend.engagement_score}
                  </div>
                  <div className="text-xs text-gray-500">Engagement</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => generatePostFromTrend(trend)}
                  disabled={generating === trend.id}
                  className={`
                    flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${generating === trend.id 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'}
                  `}
                >
                  {generating === trend.id ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">🤖</span>
                      Generate AI Post
                    </>
                  )}
                </button>
                
                {trend.url && (
                  <button
                    onClick={() => window.open(trend.url, '_blank')}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    🔗
                  </button>
                )}
              </div>
            </div>

            {/* Trend Timeline */}
            <div className="px-4 py-3 bg-gray-50 border-t">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {trend.created_at ? new Date(trend.created_at).toLocaleDateString() : 'Today'}
                </span>
                <span>
                  {trend.sourceName || trend.source}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {trends.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📈</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No trending topics found</h3>
          <p className="text-gray-600 mb-6">
            We&apos;re working on detecting the latest trends. Check back in a few minutes!
          </p>
          <button
            onClick={loadTrendingTopics}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Refresh Now
          </button>
        </div>
      )}

      {/* Trend Legend */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Understanding Trend Scores</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Trend Score Levels:</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 mr-2">
                  90+
                </span>
                <span className="text-sm">🔥 Viral - Extremely hot topic</span>
              </div>
              <div className="flex items-center">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-600 mr-2">
                  80-89
                </span>
                <span className="text-sm">📈 Trending - Rising fast</span>
              </div>
              <div className="flex items-center">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600 mr-2">
                  70-79
                </span>
                <span className="text-sm">⚡ Popular - Gaining traction</span>
              </div>
              <div className="flex items-center">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 mr-2">
                  60-69
                </span>
                <span className="text-sm">📊 Moderate - Steady interest</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Data Sources:</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-sm">📰 <strong>NewsAPI:</strong> Breaking news and articles</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm">🔍 <strong>Google Trends:</strong> Search volume data</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm">🤖 <strong>AI Analysis:</strong> Content categorization</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingTopics;