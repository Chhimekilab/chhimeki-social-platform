import React, { useState, useEffect } from 'react';
import analyticsService from './services/analyticsService';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import Header from './components/Layout/Header';
import MainLayout from './components/Layout/MainLayout';
import NewsSection from './components/Content/NewsSection';
import TrendingSection from './components/Content/TrendingSection';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [posts, setPosts] = useState([]);
  const [selectedNewsCategory, setSelectedNewsCategory] = useState('all');
  
  // Demo data
  const notifications = [
    { id: 1, type: 'like', user: 'Sarah Chen', content: 'liked your post about privacy', time: '2m ago', read: false },
    { id: 2, type: 'follow', user: 'Alex Rodriguez', content: 'started following you', time: '1h ago', read: false },
    { id: 3, type: 'comment', user: 'Tech Insider', content: 'commented on your post', time: '3h ago', read: true },
    { id: 4, type: 'mention', user: 'Maya Patel', content: 'mentioned you in a post', time: '1d ago', read: true }
  ];
  
  const messages = [
    { id: 1, user: 'Sarah Chen', message: 'Hey! Loved your latest post about social media privacy', time: '10m ago', unread: true },
    { id: 2, user: 'Alex Rodriguez', message: 'Thanks for the startup tips! Really helpful', time: '2h ago', unread: true },
    { id: 3, user: 'Tech Community', message: 'Welcome to our tech discussion group!', time: '1d ago', unread: false }
  ];

  const trendingNews = [
    {
      id: 1,
      category: 'tech',
      title: 'Meta Launches New VR Social Platform',
      summary: 'Meta announces revolutionary social VR experience with haptic feedback and community-driven spaces',
      source: 'TechCrunch',
      time: '2h ago',
      engagement: '12.5K',
      platform: 'twitter',
      trending: true
    },
    {
      id: 2,
      category: 'politics',
      title: 'Global Climate Summit Reaches Historic Agreement',
      summary: 'World leaders unite on comprehensive climate action plan with binding commitments',
      source: 'Reuters',
      time: '4h ago',
      engagement: '45.2K',
      platform: 'facebook',
      trending: true
    },
    {
      id: 3,
      category: 'sports',
      title: 'World Cup 2026 Stadium Construction Begins',
      summary: 'Major cities start construction for the upcoming World Cup venues with sustainable designs',
      source: 'ESPN',
      time: '6h ago',
      engagement: '23.1K',
      platform: 'tiktok',
      trending: false
    },
    {
      id: 4,
      category: 'culture',
      title: 'Breakthrough in AI-Generated Music',
      summary: 'New AI creates symphonies indistinguishable from human composers, raising artistic questions',
      source: 'Rolling Stone',
      time: '8h ago',
      engagement: '18.7K',
      platform: 'instagram',
      trending: false
    },
    {
      id: 5,
      category: 'gaming',
      title: 'Major Gaming Studio Announces Metaverse Project',
      summary: 'Popular game developer reveals plans for immersive virtual world with social features',
      source: 'IGN',
      time: '1d ago',
      engagement: '32.4K',
      platform: 'twitter',
      trending: true
    },
    {
      id: 6,
      category: 'local',
      title: 'New Community Center Opens in Downtown',
      summary: 'State-of-the-art facility brings modern amenities and programs to neighborhood',
      source: 'Local News',
      time: '3h ago',
      engagement: '2.1K',
      platform: 'neighborhood',
      trending: false
    }
  ];

  const externalTrending = {
    twitter: [
      { hashtag: '#TechBreakthrough', posts: '245K', category: 'tech' },
      { hashtag: '#ClimateAction', posts: '892K', category: 'politics' },
      { hashtag: '#WorldCup2026', posts: '156K', category: 'sports' },
      { hashtag: '#AIMusic', posts: '78K', category: 'culture' }
    ],
    facebook: [
      { topic: 'Meta VR Platform', engagement: '2.3M', category: 'tech' },
      { topic: 'Climate Summit', engagement: '5.7M', category: 'politics' },
      { topic: 'AI Music Revolution', engagement: '1.8M', category: 'culture' },
      { topic: 'Gaming Metaverse', engagement: '3.2M', category: 'gaming' }
    ],
    tiktok: [
      { trend: 'VR Dance Challenge', views: '89.5M', category: 'culture' },
      { trend: 'Tech Review Reactions', views: '45.2M', category: 'tech' },
      { trend: 'Stadium Tours', views: '23.1M', category: 'sports' },
      { trend: 'AI Music Covers', views: '67.8M', category: 'culture' }
    ],
    instagram: [
      { content: 'Behind the Scenes Tech', likes: '456K', category: 'tech' },
      { content: 'Climate Art Project', likes: '723K', category: 'culture' },
      { content: 'Stadium Architecture', likes: '234K', category: 'sports' },
      { content: 'Gaming Setup Tours', likes: '389K', category: 'gaming' }
    ]
  };

  useEffect(() => {
    const initializeApp = async () => {
      const demoPosts = [
        {
          id: 'post_1',
          author: 'Sarah Chen',
          avatar: 'SC',
          title: 'The Future of Social Media Privacy',
          content: 'As we navigate an increasingly connected world, the importance of digital privacy cannot be overstated. Here are my thoughts on building platforms that respect user data while fostering meaningful connections.',
          timestamp: '2h ago',
          likes: 124,
          comments: 18,
          trending: true,
          isPremium: true
        },
        {
          id: 'post_2',
          author: 'Tech Insider',
          avatar: 'TI',
          title: 'Behind the Scenes: Creating Viral Content',
          content: 'After creating content for over 5 years, I\'ve learned that viral content isn\'t about luck—it\'s about understanding your audience and timing.',
          timestamp: '3h ago',
          likes: 89,
          comments: 12,
          trending: false,
          isPremium: true
        },
        {
          id: 'post_3',
          author: 'Alex Rodriguez',
          avatar: 'AR',
          title: 'Building My First SaaS: Lessons Learned',
          content: 'Six months ago, I launched my first SaaS product. Here\'s everything I wish I knew before starting.',
          timestamp: '5h ago',
          likes: 156,
          comments: 34,
          trending: true,
          isPremium: false
        }
      ];

      setPosts(demoPosts);
      
      const user = {
        id: 'demo_user_123',
        full_name: 'Demo User',
        subscription_tier: 'premium',
        followers_count: 156,
        following_count: 89
      };
      
      setCurrentUser(user);
      
      // Initialize analytics
      analyticsService.setUserId(user.id);
      analyticsService.trackPageView('app_loaded', {
        userTier: user.subscription_tier,
        followersCount: user.followers_count,
        platform: 'web'
      });
      
      setLoading(false);
    };

    initializeApp();
  }, []);

  const handleTabSwitch = (newTab) => {
    if (newTab !== activeTab) {
      analyticsService.trackTabSwitch(activeTab, newTab);
      setActiveTab(newTab);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'news':
        return (
          <NewsSection 
            selectedCategory={selectedNewsCategory}
            onCategoryChange={setSelectedNewsCategory}
            trendingNews={trendingNews}
          />
        );
      case 'trending':
        return <TrendingSection externalTrending={externalTrending} />;
      case 'communities':
        return (
          <div className="space-y-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Communities</h2>
              <p className="text-gray-600">Connect with like-minded people in your area</p>
            </div>
          </div>
        );
      case 'neighborhood':
        return (
          <div className="space-y-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Neighborhood</h2>
              <p className="text-gray-600">Discover local businesses and community events</p>
            </div>
          </div>
        );
      case 'analytics':
        return <AnalyticsDashboard />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading Chhimeki...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        activeTab={activeTab}
        onTabChange={handleTabSwitch}
        currentUser={currentUser}
        notifications={notifications}
        messages={messages}
      />
      
      <MainLayout 
        activeTab={activeTab}
        featuredContent={posts}
        liveContent={[
          { title: 'Tech Innovation Discussion', description: 'Join 245 people discussing the latest tech trends' },
          { title: 'Community Spotlight', description: '89 neighbors sharing local business recommendations' },
          { title: 'Breaking: New Privacy Features', description: 'Live updates on social media privacy developments' },
          { title: 'Neighborhood Watch', description: 'Real-time community safety updates and alerts' }
        ]}
        elsewhereContent={[
          { title: 'Community Success Stories', type: 'audio', duration: '15 min', source: 'Chhimeki Podcast' },
          { title: 'Local Business Spotlight', type: 'video', duration: '8 min', source: 'Chhimeki TV' },
          { title: 'Privacy Workshop Recording', type: 'audio', duration: '22 min', source: 'Tech Talks' },
          { title: 'Neighborhood Tour', type: 'video', duration: '12 min', source: 'Community Stories' }
        ]}
      >
        {renderTabContent()}
      </MainLayout>
    </div>
  );
};

export default App;
