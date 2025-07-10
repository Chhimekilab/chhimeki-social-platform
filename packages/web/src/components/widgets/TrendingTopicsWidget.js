import React, { useState, useEffect } from 'react';
import { TrendingUp, Hash, MessageCircle, Users, ArrowUp, ArrowDown } from 'lucide-react';

const TrendingTopicsWidget = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('24h');

  // Mock trending data
  useEffect(() => {
    const fetchTrends = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockTrends = [
        {
          id: 1,
          topic: '#TechTrends2025',
          category: 'Technology',
          posts: 1247,
          change: '+23%',
          trend: 'up',
          description: 'Latest innovations shaping the tech landscape'
        },
        {
          id: 2,
          topic: '#RemoteWork',
          category: 'Lifestyle',
          posts: 856,
          change: '+12%',
          trend: 'up',
          description: 'Future of remote work discussions'
        },
        {
          id: 3,
          topic: '#SustainableTech',
          category: 'Environment',
          posts: 634,
          change: '+45%',
          trend: 'up',
          description: 'Green technology and sustainability'
        },
        {
          id: 4,
          topic: '#StartupLife',
          category: 'Business',
          posts: 523,
          change: '-5%',
          trend: 'down',
          description: 'Entrepreneurship and startup culture'
        },
        {
          id: 5,
          topic: '#DesignThinking',
          category: 'Design',
          posts: 412,
          change: '+18%',
          trend: 'up',
          description: 'UX/UI design methodologies'
        },
        {
          id: 6,
          topic: '#AIRevolution',
          category: 'Technology',
          posts: 1456,
          change: '+67%',
          trend: 'up',
          description: 'Artificial Intelligence breakthroughs'
        }
      ];
      
      setTrends(mockTrends);
      setLoading(false);
    };

    fetchTrends();
  }, [timeFilter]);

  const getCategoryColor = (category) => {
    const colors = {
      'Technology': 'bg-blue-100 text-blue-800',
      'Lifestyle': 'bg-green-100 text-green-800',
      'Environment': 'bg-emerald-100 text-emerald-800',
      'Business': 'bg-purple-100 text-purple-800',
      'Design': 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-900">Trending Topics</h3>
        </div>
        
        {/* Time Filter */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {['24h', '7d', '30d'].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                timeFilter === filter
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Trending List */}
      <div className="space-y-4">
        {trends.map((trend, index) => (
          <div
            key={trend.id}
            className="group cursor-pointer p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/50 transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                  <Hash className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {trend.topic.replace('#', '')}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{trend.description}</p>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">
                      {formatNumber(trend.posts)} posts
                    </span>
                  </div>
                  
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(trend.category)}`}>
                    {trend.category}
                  </span>
                </div>
              </div>
              
              {/* Trend Indicator */}
              <div className="flex flex-col items-end space-y-1">
                <div className={`flex items-center space-x-1 ${
                  trend.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend.trend === 'up' ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">{trend.change}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* See More */}
      <div className="mt-6 text-center">
        <button className="text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors">
          View All Trends
        </button>
      </div>

      {/* Footer Stats */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>12.5K active discussions</span>
          </div>
          <span>•</span>
          <span>Updated every hour</span>
        </div>
      </div>
    </div>
  );
};

export default TrendingTopicsWidget;