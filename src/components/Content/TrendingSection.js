import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Hash, 
  Users, 
  Music, 
  Camera, 
  Eye,
  ArrowUp,
  ArrowDown,
  Minus,
  Clock,
  Zap,
  Globe,
  Play
} from 'lucide-react';
import analyticsService from '../../services/analyticsService';

const TrendingSection = ({ externalTrending = {} }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [liveUpdate, setLiveUpdate] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const platforms = [
    { id: 'all', name: 'All Platforms', icon: Globe, color: 'bg-gray-600' },
    { id: 'twitter', name: 'Twitter', icon: Hash, color: 'bg-blue-500' },
    { id: 'facebook', name: 'Facebook', icon: Users, color: 'bg-blue-600' },
    { id: 'tiktok', name: 'TikTok', icon: Music, color: 'bg-gray-900' },
    { id: 'instagram', name: 'Instagram', icon: Camera, color: 'bg-pink-500' }
  ];

  useEffect(() => {
    if (liveUpdate) {
      const interval = setInterval(() => {
        setLastUpdated(new Date());
      }, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [liveUpdate]);

  const getTrendingData = () => {
    if (selectedPlatform === 'all') {
      return Object.entries(externalTrending).flatMap(([platform, items]) =>
        items.map(item => ({ ...item, platform, trend: Math.random() > 0.5 ? 'up' : 'down' }))
      );
    }
    return (externalTrending[selectedPlatform] || []).map(item => ({ 
      ...item, 
      platform: selectedPlatform,
      trend: Math.random() > 0.5 ? 'up' : 'down'
    }));
  };

  const trendingData = getTrendingData();

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPlatformIcon = (platform) => {
    const platformData = platforms.find(p => p.id === platform);
    if (!platformData) return <Globe className="w-4 h-4" />;
    return <platformData.icon className="w-4 h-4" />;
  };

  const getPlatformColor = (platform) => {
    const platformData = platforms.find(p => p.id === platform);
    return platformData?.color || 'bg-gray-500';
  };

  return (
    <div className="space-y-8">
      {/* Header with Live Indicator */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            {liveUpdate && <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>}
            <h1 className="text-3xl font-bold text-gray-900">Trending Now</h1>
          </div>
          <p className="text-gray-600">Real-time trending topics across social platforms</p>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <Clock className="w-4 h-4" />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
          <button 
            onClick={() => setLiveUpdate(!liveUpdate)}
            className={`airbnb-button ${liveUpdate ? 'airbnb-button-primary' : 'airbnb-button-secondary'}`}
          >
            <Zap className="w-4 h-4 mr-2" />
            {liveUpdate ? 'Live Updates On' : 'Live Updates Off'}
          </button>
        </div>
      </div>

      {/* Platform Filter */}
      <div className="bbc-card p-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {platforms.map((platform) => {
            const isActive = selectedPlatform === platform.id;
            return (
              <button
                key={platform.id}
                onClick={() => {
                  setSelectedPlatform(platform.id);
                  analyticsService.trackEvent('trending_platform_filter', { platform: platform.id });
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <platform.icon className="w-4 h-4" />
                <span className="font-medium">{platform.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trending Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trendingData.map((item, index) => (
          <article 
            key={`${item.platform}-${index}`} 
            className="bbc-card p-6 group cursor-pointer"
            onClick={() => {
              analyticsService.trackTrendingItemClick(
                item.hashtag || item.topic || item.trend || item.content,
                item.platform,
                'trending_card',
                index + 1
              );
            }}
          >
            {/* Platform and Trend Indicator */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-lg ${getPlatformColor(item.platform)}`}>
                  {getPlatformIcon(item.platform)}
                  <span className="sr-only">{item.platform}</span>
                </div>
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {item.platform}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(item.trend)}
                <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
              </div>
            </div>

            {/* Content */}
            <div className="mb-4">
              <h3 className="reading-title text-lg mb-2 group-hover:text-red-600 transition-colors">
                {item.hashtag || item.topic || item.trend || item.content}
              </h3>
              
              {item.category && (
                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full mb-2">
                  {item.category}
                </span>
              )}
            </div>

            {/* Metrics */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Engagement:</span>
                <span className="font-semibold text-gray-900">
                  {item.posts || item.engagement || item.views || item.likes}
                </span>
              </div>
              
              {item.platform === 'tiktok' && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Views:</span>
                  <span className="font-semibold text-gray-900">{item.views}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Trend:</span>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(item.trend)}
                  <span className={`font-semibold ${
                    item.trend === 'up' ? 'text-green-600' : 
                    item.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {item.trend === 'up' ? 'Rising' : item.trend === 'down' ? 'Falling' : 'Stable'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button className="w-full airbnb-button airbnb-button-secondary text-sm">
                <Eye className="w-4 h-4 mr-2" />
                View on {item.platform}
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Live Trending Summary */}
      <section className="bbc-section">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Trending Summary</h2>
          <div className="w-12 h-1 bg-red-600 rounded"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Trending Topics', value: trendingData.length, icon: TrendingUp, color: 'text-blue-600' },
            { label: 'Rising Fast', value: trendingData.filter(item => item.trend === 'up').length, icon: ArrowUp, color: 'text-green-600' },
            { label: 'Most Active Platform', value: 'Twitter', icon: Hash, color: 'text-blue-500' },
            { label: 'Live Updates', value: liveUpdate ? 'Active' : 'Paused', icon: Zap, color: 'text-red-600' }
          ].map((stat, index) => (
            <div key={index} className="bbc-card p-4 text-center">
              <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Timeline */}
      <section className="bbc-section">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Trending Timeline</h2>
          <div className="w-12 h-1 bg-red-600 rounded"></div>
        </div>
        
        <div className="bbc-card p-6">
          <div className="space-y-4">
            {[
              { time: '2 min ago', event: 'New trending topic: #TechInnovation on Twitter', type: 'new' },
              { time: '5 min ago', event: 'Meta VR Platform gained 50K more mentions on Facebook', type: 'update' },
              { time: '8 min ago', event: 'Climate Action dropped out of top 10 on Instagram', type: 'decline' },
              { time: '12 min ago', event: 'VR Dance Challenge reached 100M views on TikTok', type: 'milestone' }
            ].map((event, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className={`w-3 h-3 rounded-full mt-2 ${
                  event.type === 'new' ? 'bg-green-500' :
                  event.type === 'update' ? 'bg-blue-500' :
                  event.type === 'milestone' ? 'bg-purple-500' : 'bg-red-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{event.event}</p>
                  <p className="text-sm text-gray-500">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrendingSection;