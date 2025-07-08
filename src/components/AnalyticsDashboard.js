import React, { useState, useEffect } from 'react';
import analyticsService from '../services/analyticsService';
import {
  BarChart3,
  Users,
  TrendingUp,
  Eye,
  Heart,
  MessageSquare,
  Share,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
  Activity,
  Target,
  AlertTriangle,
  Download,
  RefreshCw,
  Filter,
  Search,
  Clock
} from 'lucide-react';

const AnalyticsDashboard = ({ currentUser }) => {
  const [analytics, setAnalytics] = useState({
    overview: {
      totalUsers: 1234,
      activeUsers: 567,
      totalSessions: 2890,
      avgSessionDuration: '4m 32s',
      bounceRate: 23.4,
      engagementRate: 67.8
    },
    realTimeMetrics: {
      currentActiveUsers: 45,
      recentEvents: [],
      topContent: [],
      liveInteractions: 0
    },
    userBehavior: {
      topPages: [],
      userJourney: [],
      conversionFunnels: []
    },
    contentPerformance: {
      topPosts: [],
      viralContent: [],
      engagementTrends: []
    },
    platformMetrics: {
      webUsers: 45,
      mobileUsers: 67,
      deviceBreakdown: {
        web: 35,
        ios: 40,
        android: 25
      }
    }
  });

  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [exportData, setExportData] = useState(null);

  const timeRanges = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'realtime', name: 'Real-time', icon: Activity },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'content', name: 'Content', icon: Eye },
    { id: 'engagement', name: 'Engagement', icon: Heart },
    { id: 'experiments', name: 'A/B Tests', icon: Target }
  ];

  useEffect(() => {
    loadAnalyticsData();
    
    // Refresh real-time data every 30 seconds
    const interval = setInterval(() => {
      if (activeTab === 'realtime') {
        loadRealTimeData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [selectedTimeRange, activeTab]);

  const loadAnalyticsData = async () => {
    try {
      // Simulate loading analytics data
      // In real implementation, this would call your analytics API
      setIsRefreshing(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock data based on time range
      const mockData = generateMockAnalytics(selectedTimeRange);
      setAnalytics(mockData);
      
      // Track dashboard view
      analyticsService.trackPageView('analytics_dashboard', {
        timeRange: selectedTimeRange,
        activeTab
      });
      
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      analyticsService.trackError('analytics_load_error', error.message, 'dashboard');
    } finally {
      setIsRefreshing(false);
    }
  };

  const loadRealTimeData = async () => {
    try {
      // Get real-time data from local storage for demo
      const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      const recentEvents = events.slice(-10).reverse();
      
      setAnalytics(prev => ({
        ...prev,
        realTimeMetrics: {
          ...prev.realTimeMetrics,
          recentEvents,
          currentActiveUsers: Math.floor(Math.random() * 100) + 20,
          liveInteractions: events.length
        }
      }));
    } catch (error) {
      console.error('Failed to load real-time data:', error);
    }
  };

  const generateMockAnalytics = (timeRange) => {
    const multiplier = timeRange === '1h' ? 1 : timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
    
    return {
      overview: {
        totalUsers: Math.floor(1234 * (multiplier / 168)),
        activeUsers: Math.floor(567 * (multiplier / 168)),
        totalSessions: Math.floor(2890 * (multiplier / 168)),
        avgSessionDuration: '4m 32s',
        bounceRate: 23.4 + Math.random() * 10,
        engagementRate: 67.8 + Math.random() * 15
      },
      realTimeMetrics: {
        currentActiveUsers: Math.floor(Math.random() * 100) + 20,
        recentEvents: JSON.parse(localStorage.getItem('analytics_events') || '[]').slice(-10),
        topContent: [
          { title: 'The Future of Social Media Privacy', views: 1234, engagement: 78 },
          { title: 'Building My First SaaS', views: 987, engagement: 65 },
          { title: 'Behind the Scenes: Creating Viral Content', views: 756, engagement: 89 }
        ],
        liveInteractions: Math.floor(Math.random() * 1000) + 500
      },
      userBehavior: {
        topPages: [
          { page: '/home', visits: 4567, avgTime: '3m 45s', bounceRate: 25.3 },
          { page: '/news', visits: 3210, avgTime: '5m 12s', bounceRate: 18.7 },
          { page: '/trending', visits: 2890, avgTime: '2m 58s', bounceRate: 35.2 },
          { page: '/communities', visits: 1876, avgTime: '7m 23s', bounceRate: 12.4 }
        ],
        conversionFunnels: [
          { step: 'Landing Page', users: 1000, conversion: 100 },
          { step: 'Sign Up', users: 750, conversion: 75 },
          { step: 'Profile Setup', users: 600, conversion: 60 },
          { step: 'First Post', users: 450, conversion: 45 },
          { step: 'Active User', users: 300, conversion: 30 }
        ]
      },
      contentPerformance: {
        topPosts: [
          { id: 1, title: 'Tech Conference 2025 Highlights', author: 'Sarah Chen', views: 12500, likes: 890, shares: 234, engagement: 92.5 },
          { id: 2, title: 'The Future of Remote Work', author: 'Alex Rodriguez', views: 8900, likes: 567, shares: 189, engagement: 78.3 },
          { id: 3, title: 'AI in Creative Industries', author: 'Maya Patel', views: 7650, likes: 445, shares: 156, engagement: 85.7 }
        ],
        viralContent: [
          { id: 1, title: 'VR Dance Challenge', platform: 'TikTok', views: '89.5M', shareRate: 15.6 },
          { id: 2, title: '#TechBreakthrough', platform: 'Twitter', mentions: '245K', engagement: 12.3 },
          { id: 3, title: 'Behind the Scenes Tech', platform: 'Instagram', likes: '456K', saves: 23.4 }
        ]
      },
      platformMetrics: {
        webUsers: 45 + Math.floor(Math.random() * 20),
        mobileUsers: 67 + Math.floor(Math.random() * 30),
        deviceBreakdown: {
          web: 35 + Math.floor(Math.random() * 10),
          ios: 40 + Math.floor(Math.random() * 15),
          android: 25 + Math.floor(Math.random() * 10)
        }
      }
    };
  };

  const handleExportData = async () => {
    try {
      analyticsService.trackEvent('analytics_export_requested', {
        timeRange: selectedTimeRange,
        dataType: 'dashboard'
      });

      // Simulate data export
      const exportData = {
        exportDate: new Date().toISOString(),
        timeRange: selectedTimeRange,
        data: analytics
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-export-${selectedTimeRange}-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      analyticsService.trackError('analytics_export_error', error.message, 'dashboard');
    }
  };

  const MetricCard = ({ title, value, change, icon: Icon, trend = 'up' }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-2 flex items-center ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`w-4 h-4 mr-1 ${
                trend === 'down' ? 'transform rotate-180' : ''
              }`} />
              {change}
            </p>
          )}
        </div>
        <div className="p-3 bg-orange-100 rounded-full">
          <Icon className="w-6 h-6 text-orange-600" />
        </div>
      </div>
    </div>
  );

  const RealTimeEvent = ({ event }) => {
    const getEventIcon = (eventName) => {
      switch (eventName) {
        case 'post_like': return Heart;
        case 'post_share': return Share;
        case 'post_comment': return MessageSquare;
        case 'page_view': return Eye;
        default: return Activity;
      }
    };

    const Icon = getEventIcon(event.eventName);
    
    return (
      <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
        <Icon className="w-4 h-4 text-gray-500" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">
            {event.eventName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(event.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Track user engagement and platform performance</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Time Range Selector */}
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {timeRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>

              {/* Refresh Button */}
              <button
                onClick={loadAnalyticsData}
                disabled={isRefreshing}
                className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>

              {/* Export Button */}
              <button
                onClick={handleExportData}
                className="flex items-center space-x-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Users"
                value={analytics.overview.totalUsers.toLocaleString()}
                change="+12.5%"
                icon={Users}
              />
              <MetricCard
                title="Active Users"
                value={analytics.overview.activeUsers.toLocaleString()}
                change="+8.3%"
                icon={Activity}
              />
              <MetricCard
                title="Total Sessions"
                value={analytics.overview.totalSessions.toLocaleString()}
                change="+15.7%"
                icon={Eye}
              />
              <MetricCard
                title="Avg Session Duration"
                value={analytics.overview.avgSessionDuration}
                change="+5.2%"
                icon={Clock}
              />
            </div>

            {/* Platform Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Distribution</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Monitor className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">Web</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${analytics.platformMetrics.deviceBreakdown.web}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{analytics.platformMetrics.deviceBreakdown.web}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">iOS</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${analytics.platformMetrics.deviceBreakdown.ios}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{analytics.platformMetrics.deviceBreakdown.ios}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium">Android</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full" 
                          style={{ width: `${analytics.platformMetrics.deviceBreakdown.android}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{analytics.platformMetrics.deviceBreakdown.android}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Metrics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Bounce Rate</span>
                    <span className="text-sm font-bold text-gray-900">{analytics.overview.bounceRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Engagement Rate</span>
                    <span className="text-sm font-bold text-gray-900">{analytics.overview.engagementRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Return Visitors</span>
                    <span className="text-sm font-bold text-gray-900">64.3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">New vs Returning</span>
                    <span className="text-sm font-bold text-gray-900">36:64</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Real-time Tab */}
        {activeTab === 'realtime' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Active Users"
                value={analytics.realTimeMetrics.currentActiveUsers}
                icon={Users}
              />
              <MetricCard
                title="Live Interactions"
                value={analytics.realTimeMetrics.liveInteractions}
                icon={Activity}
              />
              <MetricCard
                title="Current Sessions"
                value="127"
                icon={Eye}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Events</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {analytics.realTimeMetrics.recentEvents.length > 0 ? (
                    analytics.realTimeMetrics.recentEvents.map((event, index) => (
                      <RealTimeEvent key={index} event={event} />
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recent events</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Content Right Now</h3>
                <div className="space-y-3">
                  {analytics.realTimeMetrics.topContent.map((content, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{content.title}</p>
                        <p className="text-xs text-gray-500">{content.views} views</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-orange-600">{content.engagement}%</p>
                        <p className="text-xs text-gray-500">engagement</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs would be implemented similarly */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Analytics</h3>
            <p className="text-gray-600">Detailed user behavior analysis coming soon...</p>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Content</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Content
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Views
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Engagement
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analytics.contentPerformance.topPosts.map((post) => (
                      <tr key={post.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{post.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{post.author}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{post.views.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">{post.engagement}%</div>
                            <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${post.engagement}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;