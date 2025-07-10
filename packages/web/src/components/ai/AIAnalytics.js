import React, { useState, useEffect } from 'react';
import AIService from '../../services/ai';

const AIAnalytics = ({ analytics }) => {
  const [moderationStats, setModerationStats] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('engagement');
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    loadModerationStats();
  }, []);

  const loadModerationStats = async () => {
    try {
      const stats = await AIService.getModerationStats();
      setModerationStats(stats);
    } catch (error) {
      console.error('Error loading moderation stats:', error);
    }
  };

  const getMetricColor = (value, max) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const renderProgressBar = (label, value, max, color) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-600">{value}/{max}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
        ></div>
      </div>
    </div>
  );

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
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
            <span className="text-3xl mr-2">📊</span>
            AI Analytics
          </h2>
          <p className="text-gray-600 mt-1">
            Comprehensive insights into AI performance and engagement
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="engagement">Engagement</option>
            <option value="quality">Quality</option>
            <option value="trends">Trends</option>
            <option value="moderation">Moderation</option>
          </select>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-blue-600">{analytics.overview.totalPosts}</p>
            </div>
            <div className="text-3xl">📝</div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            ↗️ {analytics.performance.postsPerHour.toFixed(1)} posts/hour
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Trends Detected</p>
              <p className="text-2xl font-bold text-green-600">{analytics.overview.totalTrends}</p>
            </div>
            <div className="text-3xl">📈</div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            📊 {analytics.performance.trendsPerHour.toFixed(1)} trends/hour
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Engagement</p>
              <p className="text-2xl font-bold text-purple-600">{analytics.overview.averageEngagement}</p>
            </div>
            <div className="text-3xl">💬</div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            👍 Per post metric
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Moderation Rate</p>
              <p className="text-2xl font-bold text-orange-600">
                {moderationStats ? `${moderationStats.flagRate}%` : 'N/A'}
              </p>
            </div>
            <div className="text-3xl">🛡️</div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            🔍 Content filtered
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Analysis */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Engagement Analysis</h3>
          <div className="space-y-4">
            {analytics.recent.posts.slice(0, 5).map((post, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-900 truncate">
                    {post.content.substring(0, 40)}...
                  </p>
                  <p className="text-xs text-gray-500">{post.relativeTime}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {((post.likes || 0) + (post.comments || 0) + (post.shares || 0))}
                  </span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${Math.min(((post.likes || 0) + (post.comments || 0) + (post.shares || 0)) * 10, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Metrics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Quality Metrics</h3>
          <div className="space-y-4">
            {renderProgressBar(
              'High Quality Posts (80%+)',
              analytics.recent.posts.filter(p => p.quality_score > 0.8).length,
              analytics.recent.posts.length,
              'bg-green-500'
            )}
            {renderProgressBar(
              'Medium Quality Posts (60-80%)',
              analytics.recent.posts.filter(p => p.quality_score >= 0.6 && p.quality_score <= 0.8).length,
              analytics.recent.posts.length,
              'bg-yellow-500'
            )}
            {renderProgressBar(
              'Low Quality Posts (<60%)',
              analytics.recent.posts.filter(p => p.quality_score < 0.6).length,
              analytics.recent.posts.length,
              'bg-red-500'
            )}
          </div>
        </div>
      </div>

      {/* Trending Topics Performance */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Trending Topics Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Topic</th>
                <th className="text-left py-2">Category</th>
                <th className="text-left py-2">Trend Score</th>
                <th className="text-left py-2">Engagement</th>
                <th className="text-left py-2">Source</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recent.trends.slice(0, 8).map((trend, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2">
                    <div className="font-medium text-gray-900 truncate max-w-xs">
                      {trend.topic}
                    </div>
                  </td>
                  <td className="py-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {trend.category}
                    </span>
                  </td>
                  <td className="py-2">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{trend.trend_score}</span>
                      <div className="ml-2 w-12 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${trend.trend_score}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2">
                    <span className="text-sm text-gray-600">{trend.engagement_score}</span>
                  </td>
                  <td className="py-2">
                    <span className="text-xs text-gray-500">{trend.source}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Moderation Overview */}
      {moderationStats && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Moderation Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Content Safety</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Processed</span>
                  <span className="text-sm font-medium">{moderationStats.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Approved</span>
                  <span className="text-sm font-medium text-green-600">{moderationStats.approved}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Flagged</span>
                  <span className="text-sm font-medium text-yellow-600">{moderationStats.flagged}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Blocked</span>
                  <span className="text-sm font-medium text-red-600">{moderationStats.blocked}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Top Issues</h4>
              <div className="space-y-2">
                {moderationStats.topCategories.map((category, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 capitalize">{category.category}</span>
                    <span className="text-sm font-medium">{category.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity Log */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {analytics.recent.logs.map((log, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={`
                w-2 h-2 rounded-full mt-1.5 
                ${log.level === 'success' ? 'bg-green-500' : 
                  log.level === 'warning' ? 'bg-yellow-500' : 
                  log.level === 'error' ? 'bg-red-500' : 'bg-blue-500'}
              `}></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{log.message}</p>
                <p className="text-xs text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {((analytics.performance.uptime / (1000 * 60 * 60)) || 0).toFixed(1)}h
            </div>
            <div className="text-sm text-gray-600">System Uptime</div>
            <div className="text-xs text-gray-500 mt-1">
              {analytics.performance.uptime > 0 ? 'Running smoothly' : 'Just started'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {analytics.performance.postsPerHour.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Posts per Hour</div>
            <div className="text-xs text-gray-500 mt-1">
              {analytics.performance.postsPerHour > 1 ? 'High activity' : 'Normal activity'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {analytics.performance.trendsPerHour.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Trends per Hour</div>
            <div className="text-xs text-gray-500 mt-1">
              {analytics.performance.trendsPerHour > 0.5 ? 'Active monitoring' : 'Steady monitoring'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalytics;