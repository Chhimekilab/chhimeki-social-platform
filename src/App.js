import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Bell, 
  Heart, 
  Share, 
  TrendingUp, 
  PlayCircle, 
  Camera, 
  Clock, 
  X,
  Video,
  Image,
  Crown,
  MessageSquare,
  Globe,
  MapPin,
  Newspaper,
  Trophy,
  Music,
  Gamepad2,
  ExternalLink,
  Zap,
  Upload,
  Download,
  Eye,
  Hash,
  Calendar,
  Star,
  Activity,
  Users2,
  Building,
  Home
} from 'lucide-react';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postLoading, setPostLoading] = useState(false);
  
  // Enhanced features state
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showPeopleYouMayKnow, setShowPeopleYouMayKnow] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [selectedNewsCategory, setSelectedNewsCategory] = useState('all');
  const [showNeighborhood, setShowNeighborhood] = useState(false);
  const [userLocation, setUserLocation] = useState('San Francisco, CA');
  
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
  
  const suggestedPeople = [
    { id: 1, name: 'Maya Patel', title: 'Product Designer at Google', mutualFriends: 5, avatar: 'MP' },
    { id: 2, name: 'David Kim', title: 'Software Engineer', mutualFriends: 3, avatar: 'DK' },
    { id: 3, name: 'Lisa Zhang', title: 'Marketing Manager', mutualFriends: 8, avatar: 'LZ' }
  ];
  
  const communities = [
    { id: 1, name: 'Tech Innovators', members: '12.5K', category: 'Technology', trending: true },
    { id: 2, name: 'Startup Founders', members: '8.3K', category: 'Business', trending: false },
    { id: 3, name: 'Design Community', members: '15.2K', category: 'Design', trending: true },
    { id: 4, name: 'Remote Workers', members: '23.1K', category: 'Lifestyle', trending: false }
  ];
  
  const events = [
    { id: 1, title: 'Tech Conference 2025', date: 'Jul 15', attendees: 245, online: false },
    { id: 2, title: 'Virtual Networking Meetup', date: 'Jul 8', attendees: 89, online: true },
    { id: 3, title: 'Startup Pitch Competition', date: 'Jul 22', attendees: 156, online: false }
  ];

  const newsCategories = [
    { id: 'all', name: 'All News', icon: Globe },
    { id: 'tech', name: 'Technology', icon: Zap },
    { id: 'politics', name: 'Politics', icon: Building },
    { id: 'sports', name: 'Sports', icon: Trophy },
    { id: 'culture', name: 'Culture', icon: Music },
    { id: 'gaming', name: 'Gaming', icon: Gamepad2 },
    { id: 'local', name: 'Local', icon: MapPin }
  ];

  const trendingNews = [
    {
      id: 1,
      category: 'tech',
      title: 'Meta Launches New VR Social Platform',
      summary: 'Meta announces revolutionary social VR experience with haptic feedback',
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
      summary: 'World leaders unite on comprehensive climate action plan',
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
      summary: 'Major cities start construction for the upcoming World Cup venues',
      source: 'ESPN',
      time: '6h ago',
      engagement: '23.1K',
      platform: 'tiktok',
      trending: true
    },
    {
      id: 4,
      category: 'culture',
      title: 'Breakthrough in AI-Generated Music',
      summary: 'New AI creates symphonies indistinguishable from human composers',
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
      summary: 'Popular game developer reveals plans for immersive virtual world',
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
      summary: 'State-of-the-art facility brings modern amenities to neighborhood',
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
      { hashtag: '#WorldCup2026', posts: '156K', category: 'sports' }
    ],
    facebook: [
      { topic: 'Meta VR Platform', engagement: '2.3M', category: 'tech' },
      { topic: 'Climate Summit', engagement: '5.7M', category: 'politics' },
      { topic: 'AI Music Revolution', engagement: '1.8M', category: 'culture' }
    ],
    tiktok: [
      { trend: 'VR Dance Challenge', views: '89.5M', category: 'culture' },
      { trend: 'Tech Review Reactions', views: '45.2M', category: 'tech' },
      { trend: 'Stadium Tours', views: '23.1M', category: 'sports' }
    ],
    instagram: [
      { content: 'Behind the Scenes Tech', likes: '456K', category: 'tech' },
      { content: 'Climate Art Project', likes: '723K', category: 'culture' },
      { content: 'Stadium Architecture', likes: '234K', category: 'sports' }
    ]
  };

  const neighborhoodFeatures = [
    {
      id: 1,
      type: 'local_business',
      title: 'New Coffee Shop Opening',
      description: 'Artisan Coffee Co. opens tomorrow on Main Street',
      distance: '0.3 miles',
      likes: 45,
      category: 'business'
    },
    {
      id: 2,
      type: 'community_event',
      title: 'Weekend Farmers Market',
      description: 'Fresh produce and local vendors every Saturday',
      distance: '0.7 miles',
      likes: 128,
      category: 'event'
    },
    {
      id: 3,
      type: 'safety_alert',
      title: 'Construction Zone Alert',
      description: 'Road work on Oak Street through next week',
      distance: '1.2 miles',
      likes: 23,
      category: 'alert'
    },
    {
      id: 4,
      type: 'recommendation',
      title: 'Highly Rated Restaurant',
      description: 'Neighbors recommend the new Italian place',
      distance: '0.9 miles',
      likes: 87,
      category: 'food'
    }
  ];

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
          content: 'After creating content for over 5 years, I\'ve learned that viral content isn\'t about luck—it\'s about understanding your audience and timing. Let me share the strategies that actually work.',
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
          content: 'Six months ago, I launched my first SaaS product. Here\'s everything I wish I knew before starting, including the mistakes that cost me thousands and the wins that kept me going.',
          timestamp: '5h ago',
          likes: 156,
          comments: 34,
          trending: true,
          isPremium: false
        }
      ];

      setPosts(demoPosts);
      setCurrentUser({
        id: 'demo_user_123',
        full_name: 'Demo User',
        subscription_tier: 'premium',
        followers_count: 156,
        following_count: 89
      });
      setLoading(false);
    };

    initializeApp();
  }, []);

  const getAvatarInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleCreatePost = () => {
    if (!currentUser || !postTitle.trim()) return;

    setPostLoading(true);
    const newPostData = {
      id: 'post_' + Date.now(),
      author: currentUser.full_name,
      avatar: getAvatarInitials(currentUser.full_name),
      title: postTitle,
      content: newPost || 'New thoughts to share with the community.',
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      trending: false,
      isPremium: currentUser.subscription_tier !== 'free'
    };

    setPosts([newPostData, ...posts]);
    setNewPost('');
    setPostTitle('');
    setPostLoading(false);
  };

  const handleLikePost = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.isLiked;
        return {
          ...post,
          likes: isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !isLiked
        };
      }
      return post;
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Users className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading Chhimeki...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Chhimeki</h1>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              {[
                { id: 'home', name: 'Home', icon: Home },
                { id: 'news', name: 'News', icon: Newspaper },
                { id: 'trending', name: 'Trending', icon: TrendingUp },
                { id: 'communities', name: 'Communities', icon: Users2 },
                { id: 'neighborhood', name: 'Neighborhood', icon: MapPin }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1 font-medium transition-colors ${
                    activeTab === tab.id ? 'text-orange-600 border-b-2 border-orange-600 pb-4' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <button className="hidden md:flex items-center space-x-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:from-orange-600 hover:to-red-600 transition-all">
                <Crown className="w-4 h-4" />
                <span>Upgrade</span>
              </button>
              
              {/* Enhanced Search */}
              <div className="relative">
                <button 
                  onClick={() => setShowSearchResults(!showSearchResults)}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
                {showSearchResults && (
                  <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-4">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search people, posts, communities..."
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        autoFocus
                      />
                      <div className="mt-4 space-y-3">
                        <div className="text-sm font-medium text-gray-700">Recent Searches</div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">Tech trends 2025</span>
                          </div>
                          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">Sarah Chen</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-600 hover:text-gray-900 relative transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-medium text-gray-900">Notifications</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {notifications.map(notification => (
                        <div key={notification.id} className={`p-4 hover:bg-gray-50 ${!notification.read ? 'bg-orange-50' : ''}`}>
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs font-medium">
                              {notification.user.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">
                                <span className="font-medium">{notification.user}</span> {notification.content}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="relative">
                <button 
                  onClick={() => setShowMessages(!showMessages)}
                  className="p-2 text-gray-600 hover:text-gray-900 relative transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  {messages.some(m => m.unread) && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  )}
                </button>
                {showMessages && (
                  <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-medium text-gray-900">Messages</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {messages.map(message => (
                        <div key={message.id} className={`p-4 hover:bg-gray-50 cursor-pointer ${message.unread ? 'bg-orange-50' : ''}`}>
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs font-medium">
                              {message.user.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm">{message.user}</p>
                              <p className="text-sm text-gray-600 truncate">{message.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                            </div>
                            {message.unread && (
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {getAvatarInitials(currentUser?.full_name)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="hidden lg:block space-y-6">
            {/* Quick Stats */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-4">Your Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Posts this week</span>
                  <span className="font-medium text-gray-900">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Profile views</span>
                  <span className="font-medium text-gray-900">127</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Connections made</span>
                  <span className="font-medium text-gray-900">5</span>
                </div>
              </div>
            </div>

            {/* Communities */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">My Communities</h3>
                <button 
                  onClick={() => setShowCreateCommunity(true)}
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  Create
                </button>
              </div>
              <div className="space-y-3">
                {communities.slice(0, 3).map(community => (
                  <div key={community.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-400 rounded flex items-center justify-center text-white text-xs font-bold">
                      {community.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{community.name}</p>
                      <p className="text-xs text-gray-500">{community.members} members</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Events */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {events.map(event => (
                  <div key={event.id} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                      {event.online && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Online</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{event.date}</span>
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tab-specific content */}
            {activeTab === 'home' && (
              <>
                {/* Stories/Status */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                  <div className="flex space-x-4 overflow-x-auto pb-2">
                    <div className="flex-shrink-0 text-center cursor-pointer">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold border-4 border-white shadow-lg">
                        <Camera className="w-6 h-6" />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Your Story</p>
                    </div>
                    {['SC', 'AR', 'TI', 'MP', 'DK'].map((initials, index) => (
                      <div key={index} className="flex-shrink-0 text-center cursor-pointer">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold border-4 border-orange-400 shadow-lg">
                          {initials}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Story</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* News Tab */}
            {activeTab === 'news' && (
              <div className="space-y-6">
                {/* News Categories */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                    {newsCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedNewsCategory(category.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                          selectedNewsCategory === category.id
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <category.icon className="w-4 h-4" />
                        <span className="font-medium">{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* News Feed */}
                <div className="space-y-4">
                  {trendingNews
                    .filter(news => selectedNewsCategory === 'all' || news.category === selectedNewsCategory)
                    .map(news => (
                      <div key={news.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              news.platform === 'twitter' ? 'bg-blue-100 text-blue-800' :
                              news.platform === 'facebook' ? 'bg-blue-100 text-blue-800' :
                              news.platform === 'tiktok' ? 'bg-gray-100 text-gray-800' :
                              news.platform === 'instagram' ? 'bg-pink-100 text-pink-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {news.platform}
                            </span>
                            {news.trending && (
                              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                                🔥 Trending
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>{news.source}</span>
                            <span>•</span>
                            <span>{news.time}</span>
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{news.title}</h3>
                        <p className="text-gray-700 mb-4">{news.summary}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center space-x-1 text-gray-500">
                              <Eye className="w-4 h-4" />
                              <span className="text-sm">{news.engagement}</span>
                            </span>
                            <button className="flex items-center space-x-1 text-gray-500 hover:text-orange-600 transition-colors">
                              <Heart className="w-4 h-4" />
                              <span className="text-sm">Like</span>
                            </button>
                            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                              <Share className="w-4 h-4" />
                              <span className="text-sm">Share</span>
                            </button>
                          </div>
                          <button className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 transition-colors">
                            <ExternalLink className="w-4 h-4" />
                            <span className="text-sm font-medium">Read More</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Trending Tab */}
            {activeTab === 'trending' && (
              <div className="space-y-6">
                {/* External Platform Trending */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                        <Hash className="w-3 h-3 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900">Twitter Trending</h3>
                    </div>
                    <div className="space-y-3">
                      {externalTrending.twitter.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <span className="font-medium text-blue-600">{item.hashtag}</span>
                          <span className="text-sm text-gray-500">{item.posts}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                        <Users className="w-3 h-3 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900">Facebook Trending</h3>
                    </div>
                    <div className="space-y-3">
                      {externalTrending.facebook.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <span className="font-medium text-gray-900">{item.topic}</span>
                          <span className="text-sm text-gray-500">{item.engagement}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
                        <Music className="w-3 h-3 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900">TikTok Trending</h3>
                    </div>
                    <div className="space-y-3">
                      {externalTrending.tiktok.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <span className="font-medium text-gray-900">{item.trend}</span>
                          <span className="text-sm text-gray-500">{item.views}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-6 h-6 bg-pink-500 rounded flex items-center justify-center">
                        <Camera className="w-3 h-3 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900">Instagram Trending</h3>
                    </div>
                    <div className="space-y-3">
                      {externalTrending.instagram.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <span className="font-medium text-gray-900">{item.content}</span>
                          <span className="text-sm text-gray-500">{item.likes}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Neighborhood Tab */}
            {activeTab === 'neighborhood' && (
              <div className="space-y-6">
                {/* Location Header */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-orange-500" />
                      <span className="font-medium text-gray-900">{userLocation}</span>
                    </div>
                    <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                      Change Location
                    </button>
                  </div>
                </div>

                {/* Neighborhood Feed */}
                <div className="space-y-4">
                  {neighborhoodFeatures.map(feature => (
                    <div key={feature.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            feature.category === 'business' ? 'bg-blue-100 text-blue-800' :
                            feature.category === 'event' ? 'bg-green-100 text-green-800' :
                            feature.category === 'alert' ? 'bg-red-100 text-red-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {feature.category}
                          </span>
                          <span className="text-sm text-gray-500">{feature.distance}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-700 mb-4">{feature.description}</p>
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{feature.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-sm">Comment</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors">
                          <Share className="w-4 h-4" />
                          <span className="text-sm">Share</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Communities Tab - Enhanced */}
            {activeTab === 'communities' && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Communities</h2>
                    <button 
                      onClick={() => setShowCreateCommunity(true)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Create Community
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {communities.map(community => (
                      <div key={community.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-lg flex items-center justify-center text-white text-lg font-bold">
                            {community.name[0]}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900">{community.name}</h3>
                            <p className="text-sm text-gray-500">{community.members} members</p>
                            <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mt-1">
                              {community.category}
                            </span>
                          </div>
                          {community.trending && (
                            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                              Trending
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded font-medium transition-colors">
                            Join
                          </button>
                          <button className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded font-medium transition-colors">
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Create Post - Only on Home Tab */}
            {activeTab === 'home' && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {getAvatarInitials(currentUser?.full_name)}
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      placeholder="Give your post a compelling title..."
                      className="w-full p-3 border border-gray-200 rounded-lg mb-3 font-medium text-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />

                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="Share your thoughts, insights, or ask a question..."
                      className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                      rows="4"
                    />

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-4">
                        <button 
                          onClick={() => setShowMediaUpload(true)}
                          className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors"
                        >
                          <Image className="w-5 h-5" />
                          <span>Photo</span>
                        </button>
                        <button 
                          onClick={() => setShowMediaUpload(true)}
                          className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors"
                        >
                          <Video className="w-5 h-5" />
                          <span>Video</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors">
                          <Activity className="w-5 h-5" />
                          <span>Live</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors">
                          <Calendar className="w-5 h-5" />
                          <span>Event</span>
                        </button>
                      </div>
                      <button
                        onClick={handleCreatePost}
                        disabled={!postTitle.trim() || postLoading}
                        className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        {postLoading ? 'Publishing...' : 'Publish'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Posts Feed - Only on Home Tab */}
            {activeTab === 'home' && (
              <div className="space-y-8">
                {posts.map(post => (
                <article key={post.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white font-medium">
                      {post.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900">{post.author}</h3>
                        {post.isPremium && <Crown className="w-4 h-4 text-yellow-500" />}
                        {post.trending && (
                          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                            Trending
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        <span>{post.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-16">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h2>
                    <p className="text-gray-700 text-lg leading-relaxed mb-6">{post.content}</p>
                    
                    <div className="flex items-center space-x-6">
                      <button 
                        onClick={() => handleLikePost(post.id)}
                        className={`flex items-center space-x-2 transition-colors ${
                          post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                        <span className="font-medium">{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                        <MessageSquare className="w-5 h-5" />
                        <span className="font-medium">{post.comments}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                        <Share className="w-5 h-5" />
                        <span className="font-medium">Share</span>
                      </button>
                    </div>
                  </div>
                </article>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* User Profile Card */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-white text-lg font-bold mx-auto mb-3">
                  {getAvatarInitials(currentUser?.full_name)}
                </div>
                <h3 className="font-bold text-gray-900">{currentUser?.full_name}</h3>
                <p className="text-sm text-gray-600 capitalize flex items-center justify-center space-x-1">
                  {currentUser?.subscription_tier === 'premium' && <Crown className="w-3 h-3 text-yellow-500" />}
                  <span>{currentUser?.subscription_tier || 'Free'} Plan</span>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="font-bold text-gray-900">{currentUser?.followers_count || 0}</p>
                  <p className="text-sm text-gray-600">Followers</p>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{currentUser?.following_count || 0}</p>
                  <p className="text-sm text-gray-600">Following</p>
                </div>
              </div>
            </div>

            {/* People You May Know */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">People You May Know</h3>
                <button 
                  onClick={() => setShowPeopleYouMayKnow(!showPeopleYouMayKnow)}
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  See All
                </button>
              </div>
              <div className="space-y-3">
                {suggestedPeople.slice(0, 3).map(person => (
                  <div key={person.id} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {person.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{person.name}</p>
                      <p className="text-xs text-gray-500 truncate">{person.title}</p>
                      <p className="text-xs text-gray-500">{person.mutualFriends} mutual friends</p>
                    </div>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 rounded font-medium transition-colors">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* External Platform Trending */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <span>Cross-Platform Trending</span>
              </h3>
              <div className="space-y-3">
                <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Hash className="w-3 h-3 text-blue-600" />
                    <span className="text-xs font-medium text-blue-600">TWITTER</span>
                  </div>
                  <p className="font-medium text-gray-900 text-sm">#TechBreakthrough</p>
                  <p className="text-xs text-gray-500">245K tweets</p>
                </div>
                
                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Music className="w-3 h-3 text-gray-600" />
                    <span className="text-xs font-medium text-gray-600">TIKTOK</span>
                  </div>
                  <p className="font-medium text-gray-900 text-sm">VR Dance Challenge</p>
                  <p className="text-xs text-gray-500">89.5M views</p>
                </div>

                <div className="p-3 border border-pink-200 rounded-lg bg-pink-50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Camera className="w-3 h-3 text-pink-600" />
                    <span className="text-xs font-medium text-pink-600">INSTAGRAM</span>
                  </div>
                  <p className="font-medium text-gray-900 text-sm">Behind the Scenes Tech</p>
                  <p className="text-xs text-gray-500">456K likes</p>
                </div>
              </div>
            </div>

            {/* Live Events */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>Live Now</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                    <PlayCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">Tech Talk Live</p>
                    <p className="text-xs text-gray-500">1.2K watching</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                    <PlayCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">Startup Pitch</p>
                    <p className="text-xs text-gray-500">856 watching</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Upgrade */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
              <div className="text-center">
                <Crown className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Upgrade to Premium</h3>
                <p className="text-sm text-gray-600 mb-4">Unlock advanced features and support creators</p>
                <ul className="text-xs text-gray-600 mb-4 space-y-1 text-left">
                  <li>• Enhanced privacy controls</li>
                  <li>• Priority customer support</li>
                  <li>• Advanced analytics</li>
                  <li>• Exclusive community access</li>
                </ul>
                <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showCreateCommunity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create Community</h2>
                <button 
                  onClick={() => setShowCreateCommunity(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Community Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter community name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows="3"
                    placeholder="Describe your community..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                    <option>Technology</option>
                    <option>Business</option>
                    <option>Design</option>
                    <option>Lifestyle</option>
                    <option>Education</option>
                  </select>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" id="private" className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded" />
                  <label htmlFor="private" className="text-sm text-gray-700">Private Community</label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Create Community
                </button>
              </div>
            </div>
          </div>
        )}

        {showPeopleYouMayKnow && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">People You May Know</h2>
                <button 
                  onClick={() => setShowPeopleYouMayKnow(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestedPeople.map(person => (
                  <div key={person.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white font-medium">
                        {person.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{person.name}</p>
                        <p className="text-sm text-gray-500">{person.title}</p>
                        <p className="text-xs text-gray-500">{person.mutualFriends} mutual friends</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded font-medium transition-colors">
                        Follow
                      </button>
                      <button className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded font-medium transition-colors">
                        Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Media Upload Modal */}
        {showMediaUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Upload Media</h2>
                <button 
                  onClick={() => setShowMediaUpload(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">Drop files here or click to upload</p>
                  <p className="text-sm text-gray-500 mb-4">Support for images, videos, and documents</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">JPG</span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">PNG</span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">MP4</span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">GIF</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Image className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Photo</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Video className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Video</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Activity className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Go Live</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Star className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Story</span>
                  </button>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors">
                    Cancel
                  </button>
                  <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors">
                    Upload & Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
