import React, { useState, useEffect } from 'react';
import AIService from '../../services/ai';

const AIPostsDisplay = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadAIPosts();
    
    // Subscribe to new AI posts
    const unsubscribe = AIService.subscribeToAIEvents('ai_post_generated', (newPost) => {
      setPosts(prev => [newPost, ...prev]);
    });
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const loadAIPosts = async () => {
    try {
      const aiPosts = await AIService.getAIPosts(50);
      setPosts(aiPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error loading AI posts:', error);
      setLoading(false);
    }
  };

  const generateNewPost = async () => {
    try {
      setGenerating(true);
      const newPost = await AIService.forceGenerateContent();
      
      if (newPost) {
        setPosts(prev => [newPost, ...prev]);
        alert('✅ New AI post generated successfully!');
      }
    } catch (error) {
      console.error('Error generating new post:', error);
      alert('❌ Failed to generate new post. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const analyzePost = async (post) => {
    try {
      const analysis = await AIService.analyzeContentQuality(post.content);
      
      alert(`📊 Content Analysis:\n\n` +
        `Quality Score: ${analysis.qualityScore}/100\n` +
        `Word Count: ${analysis.wordCount}\n` +
        `Hashtags: ${analysis.hashtagCount}\n` +
        `Emojis: ${analysis.emojiCount}\n` +
        `Predicted Engagement: ${analysis.predictedEngagement}%\n\n` +
        `Recommendations:\n${analysis.recommendations.join('\n')}`
      );
    } catch (error) {
      console.error('Error analyzing post:', error);
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'high_quality') return post.quality_score > 0.8;
    if (filter === 'recent') return new Date(post.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000);
    return true;
  });

  const getQualityColor = (score) => {
    if (score >= 0.9) return 'text-green-600 bg-green-100';
    if (score >= 0.8) return 'text-blue-600 bg-blue-100';
    if (score >= 0.7) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getEngagementTotal = (post) => {
    return (post.likes || 0) + (post.comments || 0) + (post.shares || 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI posts...</p>
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
            <span className="text-3xl mr-2">🤖</span>
            AI-Generated Posts
          </h2>
          <p className="text-gray-600 mt-1">
            Content automatically created from trending topics
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Posts</option>
            <option value="high_quality">High Quality</option>
            <option value="recent">Recent (24h)</option>
          </select>
          <button
            onClick={generateNewPost}
            disabled={generating}
            className={`
              px-4 py-2 rounded-lg text-white font-medium transition-colors
              ${generating 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'}
            `}
          >
            {generating ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Generating...
              </>
            ) : (
              <>
                <span className="mr-2">✨</span>
                Generate New Post
              </>
            )}
          </button>
        </div>
      </div>

      {/* Posts Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-2xl font-bold text-blue-600">{posts.length}</div>
          <div className="text-sm text-gray-600">Total Posts</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-2xl font-bold text-green-600">
            {posts.reduce((sum, post) => sum + (post.likes || 0), 0)}
          </div>
          <div className="text-sm text-gray-600">Total Likes</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-2xl font-bold text-purple-600">
            {posts.reduce((sum, post) => sum + (post.comments || 0), 0)}
          </div>
          <div className="text-sm text-gray-600">Total Comments</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-2xl font-bold text-orange-600">
            {posts.filter(p => p.quality_score > 0.8).length}
          </div>
          <div className="text-sm text-gray-600">High Quality</div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.map((post, index) => (
          <div key={post.id || index} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Post Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    AI
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">Chhimeki AI</h3>
                    <p className="text-sm text-gray-600">
                      {post.relativeTime || 'Just now'} • 
                      <span className="ml-1">🤖 AI Generated</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {post.quality_score && (
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(post.quality_score)}
                    `}>
                      {Math.round(post.quality_score * 100)}%
                    </span>
                  )}
                  <button
                    onClick={() => analyzePost(post)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    📊
                  </button>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="p-4">
              <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
              
              {/* Trend Info */}
              {post.trend_topic && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    📈 Generated from trending topic: <strong>{post.trend_topic}</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Engagement Metrics */}
            <div className="px-4 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center text-gray-600">
                    <span className="mr-1">👍</span>
                    <span className="text-sm">{post.likes || 0}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="mr-1">💬</span>
                    <span className="text-sm">{post.comments || 0}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="mr-1">🔄</span>
                    <span className="text-sm">{post.shares || 0}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="mr-1">📊</span>
                    <span className="text-sm">{getEngagementTotal(post)} total</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {post.live_interaction_count > 0 && (
                    <span className="text-sm text-green-600">
                      🟢 {post.live_interaction_count} live
                    </span>
                  )}
                  {post.template_used && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {post.template_used}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Post Actions */}
            <div className="px-4 py-3 bg-gray-50 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    👍 Like
                  </button>
                  <button className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    💬 Comment
                  </button>
                  <button className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    🔄 Share
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => analyzePost(post)}
                    className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    📊 Analyze
                  </button>
                  <button className="text-xs text-gray-500 hover:text-blue-600 transition-colors">
                    🔗 Copy Link
                  </button>
                </div>
              </div>
            </div>

            {/* Generation Metadata */}
            {post.generation_time && (
              <div className="px-4 py-2 bg-gray-50 border-t">
                <p className="text-xs text-gray-500">
                  Generated in {post.generation_time}ms • 
                  Model: {post.model_used || 'gpt-3.5-turbo'} • 
                  Quality: {post.quality_score ? Math.round(post.quality_score * 100) : 'N/A'}%
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'No AI posts yet' : 'No posts match your filter'}
          </h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? 'Generate your first AI post to see content here!'
              : 'Try adjusting your filter or generate more posts.'
            }
          </p>
          <button
            onClick={generateNewPost}
            disabled={generating}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Generating...
              </>
            ) : (
              <>
                <span className="mr-2">✨</span>
                Generate First Post
              </>
            )}
          </button>
        </div>
      )}

      {/* Performance Insights */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {posts.length > 0 ? (posts.reduce((sum, post) => sum + (post.quality_score || 0), 0) / posts.length).toFixed(2) : '0.00'}
            </div>
            <div className="text-sm text-gray-600">Average Quality Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {posts.length > 0 ? (getEngagementTotal({ likes: posts.reduce((sum, post) => sum + (post.likes || 0), 0), comments: posts.reduce((sum, post) => sum + (post.comments || 0), 0), shares: posts.reduce((sum, post) => sum + (post.shares || 0), 0) }) / posts.length).toFixed(1) : '0.0'}
            </div>
            <div className="text-sm text-gray-600">Average Engagement</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {posts.filter(p => p.quality_score > 0.8).length}
            </div>
            <div className="text-sm text-gray-600">High Quality Posts</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPostsDisplay;