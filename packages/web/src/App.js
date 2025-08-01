import React, { useState, useEffect, useRef } from 'react';
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
  LogOut,
  Home,
  Eye,
  MessageCircle,
  MapPin,
  Briefcase,
  Calendar,
  Rss
} from 'lucide-react';
import AuthWrapper from './components/auth/AuthWrapper';
import { useAuth } from './contexts/AuthContext';
import WeatherWidget from './components/widgets/WeatherWidget';
import TrendingTopicsWidget from './components/widgets/TrendingTopicsWidget';
import QuickActionsWidget from './components/widgets/QuickActionsWidget';
import ActivityFeedWidget from './components/widgets/ActivityFeedWidget';
import SportsWidget from './components/widgets/SportsWidget';
import NewsWidget from './components/widgets/NewsWidget';
import AIContentGenerator from './components/ai/AIContentGenerator';
import AIAssistant from './components/ai/AIAssistant';
import { FooterVersion } from './components/version/VersionInfo';
import AIDashboard from './components/ai/AIDashboard';
import DigestViewer from './components/subscriptions/DigestViewer';
import ChatInterface from './components/chat/ChatInterface';
import ChatRooms from './components/chat/ChatRooms';

// Import new dashboard components
import NeighborhoodDashboard from './components/dashboard/NeighborhoodDashboard';
import ProfessionalDashboard from './components/dashboard/ProfessionalDashboard';

const App = () => {
  const { user: currentUser, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showRealTimeWidgets, setShowRealTimeWidgets] = useState(false);
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
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [selectedDigest, setSelectedDigest] = useState(null);
  const [showDigestViewer, setShowDigestViewer] = useState(false);
  
  // Chat system state
  const [showChatInterface, setShowChatInterface] = useState(false);
  const [showChatRooms, setShowChatRooms] = useState(false);
  const [activeChatRoom, setActiveChatRoom] = useState(null);
  const [unreadChatMessages, setUnreadChatMessages] = useState(3);
  
  // Refs for click-outside detection
  const notificationsRef = useRef(null);
  const messagesRef = useRef(null);
  const searchRef = useRef(null);

  // Available topics for subscription
  const availableTopics = [
    { id: 'politics', name: 'Politics', icon: '🏛️', description: 'Political news and analysis' },
    { id: 'technology', name: 'Technology', icon: '💻', description: 'Tech trends and innovations' },
    { id: 'business', name: 'Business', icon: '💼', description: 'Business news and market updates' },
    { id: 'science', name: 'Science', icon: '🔬', description: 'Scientific discoveries and research' },
    { id: 'health', name: 'Health', icon: '🏥', description: 'Health news and medical breakthroughs' },
    { id: 'environment', name: 'Environment', icon: '🌱', description: 'Climate and environmental news' },
    { id: 'sports', name: 'Sports', icon: '⚽', description: 'Sports news and updates' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬', description: 'Movies, TV, and celebrity news' },
    { id: 'finance', name: 'Finance', icon: '💰', description: 'Financial markets and cryptocurrency' },
    { id: 'education', name: 'Education', icon: '📚', description: 'Educational news and resources' },
    { id: 'travel', name: 'Travel', icon: '✈️', description: 'Travel guides and destination news' },
    { id: 'food', name: 'Food & Dining', icon: '🍽️', description: 'Food trends and restaurant news' }
  ];

  // Sample user subscriptions (in real app, this would come from backend)
  const defaultSubscriptions = [
    { 
      id: 'sub_1', 
      topicId: 'technology', 
      frequency: 'daily', 
      enabled: true,
      lastDigest: '2024-01-15T10:00:00Z',
      nextDigest: '2024-01-16T10:00:00Z'
    },
    { 
      id: 'sub_2', 
      topicId: 'business', 
      frequency: 'weekly', 
      enabled: true,
      lastDigest: '2024-01-10T09:00:00Z',
      nextDigest: '2024-01-17T09:00:00Z'
    }
  ];
  
  const notifications = [
    { id: 1, type: 'like', user: 'Sarah Chen', content: 'liked your post about privacy', time: '2m ago', read: false },
    { id: 2, type: 'follow', user: 'Alex Rodriguez', content: 'started following you', time: '1h ago', read: false },
    { id: 3, type: 'chat', user: 'Anonymous User', content: 'wants to chat with you', time: '5m ago', read: false },
    { id: 4, type: 'chat_room', user: 'Tech Community', content: 'new messages in Tech Talk room', time: '15m ago', read: false },
    { id: 5, type: 'comment', user: 'Tech Insider', content: 'commented on your post', time: '3h ago', read: true },
    { id: 6, type: 'mention', user: 'Maya Patel', content: 'mentioned you in a post', time: '1d ago', read: true }
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
      setUserSubscriptions(defaultSubscriptions);
      setLoading(false);
    };

    initializeApp();
  }, []);

  // Subscription management functions
  const handleSubscribe = (topicId, frequency = 'weekly') => {
    const newSubscription = {
      id: 'sub_' + Date.now(),
      topicId,
      frequency,
      enabled: true,
      lastDigest: null,
      nextDigest: getNextDigestDate(frequency)
    };
    
    setUserSubscriptions(prev => [...prev, newSubscription]);
  };

  const handleUnsubscribe = (subscriptionId) => {
    setUserSubscriptions(prev => prev.filter(sub => sub.id !== subscriptionId));
  };

  const handleUpdateSubscription = (subscriptionId, updates) => {
    setUserSubscriptions(prev => 
      prev.map(sub => 
        sub.id === subscriptionId 
          ? { ...sub, ...updates, nextDigest: getNextDigestDate(updates.frequency || sub.frequency) }
          : sub
      )
    );
  };

  const getNextDigestDate = (frequency) => {
    const now = new Date();
    switch (frequency) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      case 'monthly':
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    }
  };

  const isSubscribed = (topicId) => {
    return userSubscriptions.some(sub => sub.topicId === topicId && sub.enabled);
  };

  const getSubscription = (topicId) => {
    return userSubscriptions.find(sub => sub.topicId === topicId && sub.enabled);
  };

  // Click outside detection
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (messagesRef.current && !messagesRef.current.contains(event.target)) {
        setShowMessages(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle notification clicks
  const handleNotificationClick = (notificationId) => {
    // Mark notification as read and close dropdown
    setShowNotifications(false);
    // Here you could add logic to mark the notification as read
  };

  // Handle message clicks
  const handleMessageClick = (messageId) => {
    // Mark message as read and close dropdown
    setShowMessages(false);
    // Here you could add logic to open the message thread
  };

  // Handle tab switching with better home navigation
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    // Close any open dropdowns when switching tabs
    setShowNotifications(false);
    setShowMessages(false);
    setShowSearchResults(false);
    setShowChatRooms(false);
    setShowChatInterface(false);
  };

  // Chat system handlers
  const handleOpenRandomChat = () => {
    setShowChatInterface(true);
    setShowChatRooms(false);
    setActiveChatRoom(null);
  };

  const handleOpenChatRooms = () => {
    setShowChatRooms(true);
    setShowChatInterface(false);
  };

  const handleJoinChatRoom = (room) => {
    setActiveChatRoom(room);
    setShowChatRooms(false);
    setShowChatInterface(true);
  };

  const handleCloseChatInterface = () => {
    setShowChatInterface(false);
    setActiveChatRoom(null);
  };

  const handleCloseChatRooms = () => {
    setShowChatRooms(false);
  };

  // Digest viewing handlers
  const handleViewDigest = (subscription) => {
    setSelectedDigest(subscription);
    setShowDigestViewer(true);
    setShowSubscriptionModal(false);
  };

  const handleCloseDigestViewer = () => {
    setShowDigestViewer(false);
    setSelectedDigest(null);
  };

  // Enhanced subscription management
  const handleSubscribeWithDigest = async (topicId, frequency = 'weekly') => {
    handleSubscribe(topicId, frequency);
    // Auto-generate first digest
    const subscription = {
      topicId,
      frequency,
      enabled: true
    };
    
    // Show the digest preview
    setTimeout(() => {
      setSelectedDigest(subscription);
      setShowDigestViewer(true);
      setShowSubscriptionModal(false);
    }, 500);
  };

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

  const tabs = [
    { 
      id: 'home', 
      name: 'Home', 
      icon: Home, 
      component: 'feed',
      description: 'Your social feed and updates'
    },
    { 
      id: 'neighborhood', 
      name: 'Neighborhood', 
      icon: MapPin, 
      component: 'neighborhood',
      description: 'Local community, safety, and marketplace'
    },
    { 
      id: 'professional', 
      name: 'Professional', 
      icon: Briefcase, 
      component: 'professional',
      description: 'Jobs, networking, and career development'
    },
    { 
      id: 'communities', 
      name: 'Communities', 
      icon: Users, 
      component: 'communities',
      description: 'Join and manage communities'
    },
    { 
      id: 'events', 
      name: 'Events', 
      icon: Calendar, 
      component: 'events',
      description: 'Discover and create events'
    },
    { 
      id: 'stories', 
      name: 'Stories', 
      icon: Camera, 
      component: 'stories',
      description: 'Share temporary stories'
    },
    { 
      id: 'notifications', 
      name: 'Notifications', 
      icon: Bell, 
      component: 'notifications',
      description: 'Your notifications and alerts'
    },
    { 
      id: 'subscriptions', 
      name: 'Subscriptions', 
      icon: Rss, 
      component: 'subscriptions',
      description: 'AI-generated topic digests'
    }
  ];

  const renderMainContent = () => {
    // Handle new dashboard components
    if (activeTab === 'neighborhood') {
      return <NeighborhoodDashboard />;
    }
    
    if (activeTab === 'professional') {
      return <ProfessionalDashboard />;
    }

    // Chat Interface
    if (showChatInterface) {
      return (
        <ChatInterface 
          onClose={() => setShowChatInterface(false)}
          onOpenChatRooms={() => {
            setShowChatInterface(false);
            setShowChatRooms(true);
          }}
        />
      );
    }

    // Chat Rooms
    if (showChatRooms) {
      return (
        <ChatRooms 
          onClose={() => setShowChatRooms(false)}
          onJoinRoom={handleJoinChatRoom}
          onStartRandomChat={() => {
            setShowChatRooms(false);
            setShowChatInterface(true);
          }}
        />
      );
    }

    // AI Dashboard
    if (activeTab === 'subscriptions') {
      return <AIDashboard />;
    }

    // Default feed rendering (home tab)
    return (
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

        {/* Create Post */}
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
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors">
                    <Image className="w-5 h-5" />
                    <span>Photo</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors">
                    <Video className="w-5 h-5" />
                    <span>Video</span>
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

        {/* Posts Feed */}
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
      </>
    );
  };

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleTabSwitch('home')}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Chhimeki</h1>
              </button>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabSwitch(tab.id)}
                  className={`font-medium transition-colors flex items-center space-x-1 ${
                    activeTab === tab.id ? 'text-orange-600 border-b-2 border-orange-600 pb-4' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>

            {/* Mobile Home Button */}
            <button
              onClick={() => handleTabSwitch('home')}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                activeTab === 'home' ? 'text-orange-600 bg-orange-50' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Home className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-4">
              <button className="hidden md:flex items-center space-x-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:from-orange-600 hover:to-red-600 transition-all">
                <Crown className="w-4 h-4" />
                <span>Upgrade</span>
              </button>
              
              {/* Subscription Button */}
              <button 
                onClick={() => setShowSubscriptionModal(true)}
                className="flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all"
              >
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Subscriptions</span>
              </button>

              {/* Real-time Widgets Button */}
              <button 
                onClick={() => setShowRealTimeWidgets(!showRealTimeWidgets)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  showRealTimeWidgets 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600' 
                    : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Live Data</span>
              </button>

              {/* Live Chat Button */}
              <div className="relative">
                <button 
                  onClick={handleOpenChatRooms}
                  className="flex items-center space-x-1 bg-gradient-to-r from-green-500 to-teal-500 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:from-green-600 hover:to-teal-600 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Live Chat</span>
                </button>
                {unreadChatMessages > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadChatMessages}
                  </span>
                )}
              </div>

              {/* Random Chat Quick Button */}
              <button 
                onClick={handleOpenRandomChat}
                className="p-2 text-gray-600 hover:text-green-600 transition-colors relative"
                title="Start Random Chat"
              >
                <Users className="w-5 h-5" />
              </button>
              
              {/* Enhanced Search */}
              <div className="relative" ref={searchRef}>
                <button 
                  onClick={() => setShowSearchResults(!showSearchResults)}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
                {showSearchResults && (
                  <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">Search</h3>
                        <button 
                          onClick={() => setShowSearchResults(false)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
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
                          <div 
                            onClick={() => setShowSearchResults(false)}
                            className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                          >
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">Tech trends 2025</span>
                          </div>
                          <div 
                            onClick={() => setShowSearchResults(false)}
                            className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                          >
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
                  <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto" ref={notificationsRef}>
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                      <h3 className="font-medium text-gray-900">Notifications</h3>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          onClick={() => handleNotificationClick(notification.id)}
                          className={`p-4 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-orange-50' : ''}`}
                        >
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
                  <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto" ref={messagesRef}>
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                      <h3 className="font-medium text-gray-900">Messages</h3>
                      <button 
                        onClick={() => setShowMessages(false)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {messages.map(message => (
                        <div 
                          key={message.id} 
                          onClick={() => handleMessageClick(message.id)}
                          className={`p-4 hover:bg-gray-50 cursor-pointer ${message.unread ? 'bg-orange-50' : ''}`}
                        >
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
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                  console.log('🔄 Logout button clicked')
                  signOut()
                }}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
                
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {getAvatarInitials(currentUser?.full_name)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className={`grid grid-cols-1 gap-8 ${activeTab === 'ai-dashboard' ? 'lg:grid-cols-1' : 'lg:grid-cols-4'}`}>
          {/* Left Sidebar */}
          {activeTab !== 'ai-dashboard' && (
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

            {/* Activity Feed Widget */}
            <ActivityFeedWidget />
          </div>
          )}

                      {/* Main Content */}
            <div className={
              activeTab === 'subscriptions' || activeTab === 'neighborhood' || activeTab === 'professional' 
                ? 'lg:col-span-3' 
                : 'lg:col-span-2'
            }>
             {renderMainContent()}
            </div>

                      {/* Right Sidebar */}
            {!(activeTab === 'subscriptions' || activeTab === 'neighborhood' || activeTab === 'professional') && (
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

            {/* Quick Actions Widget */}
            <QuickActionsWidget />

            {/* Weather Widget */}
            <WeatherWidget />

            {/* Live Chat Widget */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-green-500" />
                <span>Live Chat</span>
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleOpenRandomChat}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white py-2 px-4 rounded-lg font-medium transition-all"
                >
                  Chat with Strangers
                </button>
                <button
                  onClick={handleOpenChatRooms}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Join Chat Rooms
                </button>
                <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t border-gray-100">
                  <span>🌍 Global users online:</span>
                  <span className="font-medium text-green-600">12,847</span>
                </div>
              </div>
            </div>

            {/* Trending Topics Widget - Enhanced */}
            <TrendingTopicsWidget />

            {/* Real-time Widgets Section */}
            {showRealTimeWidgets && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Live Real-time Data
                  </h3>
                  <p className="text-sm opacity-90 mt-1">
                    Real-time news, sports, and weather from live APIs
                  </p>
                </div>
                
                {/* Sports Widget */}
                <SportsWidget />
                
                {/* News Widget */}
                <NewsWidget />
                
                {/* Enhanced Weather Widget */}
                <WeatherWidget />
                
                {/* AI Content Generator */}
                <AIContentGenerator />
                
                {/* AI Assistant */}
                <AIAssistant currentUser={currentUser} />
              </div>
            )}

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

            {/* Trending Topics */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-4">Trending Topics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    <span className="font-medium text-gray-900">#TechNews</span>
                  </div>
                  <span className="text-sm text-gray-500">245K posts</span>
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    <span className="font-medium text-gray-900">#Innovation</span>
                  </div>
                  <span className="text-sm text-gray-500">189K posts</span>
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    <span className="font-medium text-gray-900">#Creator</span>
                  </div>
                  <span className="text-sm text-gray-500">156K posts</span>
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    <span className="font-medium text-gray-900">#SocialMedia</span>
                  </div>
                  <span className="text-sm text-gray-500">98K posts</span>
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
          )}
        </div>

        {/* Modals */}
        {showSubscriptionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Manage Subscriptions</h2>
                <button 
                  onClick={() => setShowSubscriptionModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600">Subscribe to topics you&apos;re interested in and receive AI-generated digests based on your preferred frequency.</p>
              </div>

              {/* Current Subscriptions */}
              {userSubscriptions.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Active Subscriptions</h3>
                  <div className="space-y-3">
                    {userSubscriptions.map(subscription => {
                      const topic = availableTopics.find(t => t.id === subscription.topicId);
                      if (!topic) return null;
                      
                      return (
                        <div key={subscription.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{topic.icon}</span>
                            <div>
                              <h4 className="font-medium text-gray-900">{topic.name}</h4>
                              <p className="text-sm text-gray-600">{topic.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <select 
                              value={subscription.frequency}
                              onChange={(e) => handleUpdateSubscription(subscription.id, { frequency: e.target.value })}
                              className="px-3 py-1 border border-gray-300 rounded text-sm"
                            >
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                            </select>
                            <button
                              onClick={() => handleViewDigest(subscription)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center space-x-1"
                            >
                              <Eye className="w-3 h-3" />
                              <span>View Digest</span>
                            </button>
                            <button
                              onClick={() => handleUnsubscribe(subscription.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Unsubscribe
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Available Topics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Topics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableTopics.map(topic => (
                    <div key={topic.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{topic.icon}</span>
                        <div>
                          <h4 className="font-medium text-gray-900">{topic.name}</h4>
                          <p className="text-sm text-gray-600">{topic.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isSubscribed(topic.id) ? (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            Subscribed
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSubscribeWithDigest(topic.id, 'weekly')}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Subscribe
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

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

                 {showDigestViewer && selectedDigest && (
           <DigestViewer
             subscription={selectedDigest}
             onClose={handleCloseDigestViewer}
             onViewFullDigest={handleViewDigest}
           />
         )}

         {/* Chat System Components */}
         {showChatInterface && (
           <ChatInterface
             activeChatRoom={activeChatRoom}
             onClose={handleCloseChatInterface}
           />
         )}

         {showChatRooms && (
           <ChatRooms
             onJoinRoom={handleJoinChatRoom}
             onClose={handleCloseChatRooms}
           />
         )}
      </div>

      {/* Footer with Version Info */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <FooterVersion />
        </div>
      </footer>
    </div>
    </AuthWrapper>
  );
};

export default App;
