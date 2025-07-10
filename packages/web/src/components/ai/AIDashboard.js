import React, { useState, useEffect } from 'react';
import AIService from '../../services/ai';
import TrendingTopics from './TrendingTopics';
import AIPostsDisplay from './AIPostsDisplay';
import AIAnalytics from './AIAnalytics';
import AIControls from './AIControls';
import RealTimeStatus from './RealTimeStatus';

const AIDashboard = () => {
  const [aiHealth, setAIHealth] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    initializeDashboard();
    
    // Refresh data every 30 seconds
    const interval = setInterval(refreshData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const initializeDashboard = async () => {
    try {
      console.log('🚀 Initializing AI Dashboard...');
      
      // Initialize AI services if not already done
      await AIService.initialize();
      
      // Get initial data
      await refreshData();
      
      setLoading(false);
      console.log('✅ AI Dashboard initialized');
      
    } catch (error) {
      console.error('❌ Failed to initialize AI Dashboard:', error);
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      const [healthData, analyticsData, logsData] = await Promise.all([
        AIService.getHealth(),
        AIService.getAnalytics(),
        AIService.getLogs('all', 20)
      ]);
      
      setAIHealth(healthData);
      setAnalytics(analyticsData);
      setLogs(logsData);
      
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    }
  };

  const handleServiceToggle = async (action) => {
    try {
      setLoading(true);
      
      if (action === 'start') {
        await AIService.start();
      } else if (action === 'stop') {
        await AIService.stop();
      }
      
      await refreshData();
      setLoading(false);
      
    } catch (error) {
      console.error(`Error ${action}ing AI services:`, error);
      setLoading(false);
    }
  };

  const renderServiceStatus = (service, status) => {
    const statusColor = status ? 'text-green-600' : 'text-red-600';
    const statusIcon = status ? '✅' : '❌';
    
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <span className="font-medium capitalize">{service.replace(/([A-Z])/g, ' $1').trim()}</span>
        <span className={`font-bold ${statusColor}`}>
          {statusIcon} {status ? 'Running' : 'Stopped'}
        </span>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Service Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="text-2xl mr-2">🔧</span>
                Service Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiHealth?.services && Object.entries(aiHealth.services).map(([service, status]) => (
                  <div key={service}>
                    {renderServiceStatus(service, status)}
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics Overview */}
            {analytics && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="text-2xl mr-2">📊</span>
                  Analytics Overview
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{analytics.overview.totalPosts}</div>
                    <div className="text-sm text-gray-600">AI Posts Generated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{analytics.overview.totalTrends}</div>
                    <div className="text-sm text-gray-600">Trends Detected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{analytics.overview.totalModerations}</div>
                    <div className="text-sm text-gray-600">Content Moderated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{analytics.overview.averageEngagement}</div>
                    <div className="text-sm text-gray-600">Avg Engagement</div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="text-2xl mr-2">📋</span>
                Recent Activity
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {logs.map((log, index) => (
                  <div key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium mr-2
                          ${log.level === 'error' ? 'bg-red-100 text-red-800' : 
                            log.level === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                            log.level === 'success' ? 'bg-green-100 text-green-800' : 
                            'bg-blue-100 text-blue-800'}
                        `}>
                          {log.level}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">{log.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'trends':
        return <TrendingTopics />;
        
      case 'posts':
        return <AIPostsDisplay />;
        
      case 'analytics':
        return <AIAnalytics analytics={analytics} />;
        
      case 'controls':
        return <AIControls onServiceToggle={handleServiceToggle} />;
        
      case 'realtime':
        return <RealTimeStatus />;
        
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🤖 AI Dashboard
        </h1>
        <p className="text-gray-600">
          Monitor and control AI-powered features for your social media platform
        </p>
      </div>

      {/* Overall Status Banner */}
      <div className={`
        mb-6 p-4 rounded-lg border-l-4 
        ${aiHealth?.overall ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}
      `}>
        <div className="flex items-center">
          <span className="text-2xl mr-3">
            {aiHealth?.overall ? '✅' : '❌'}
          </span>
          <div>
            <p className="font-medium">
              AI Services are {aiHealth?.overall ? 'Online' : 'Offline'}
            </p>
            <p className="text-sm text-gray-600">
              Last health check: {aiHealth?.details?.lastHealthCheck ? 
                new Date(aiHealth.details.lastHealthCheck).toLocaleString() : 
                'Never'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'trends', label: 'Trending Topics', icon: '📈' },
            { id: 'posts', label: 'AI Posts', icon: '📝' },
            { id: 'analytics', label: 'Analytics', icon: '📊' },
            { id: 'realtime', label: 'Real-time', icon: '⚡' },
            { id: 'controls', label: 'Controls', icon: '🎛️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center py-2 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AIDashboard;