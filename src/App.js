import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageCircle, 
  Shield, 
  Settings, 
  Home, 
  Search, 
  Bell, 
  Plus, 
  Eye, 
  EyeOff, 
  Heart, 
  Share, 
  Lock, 
  Globe, 
  UserCheck, 
  Building, 
  TrendingUp, 
  PlayCircle, 
  Trophy, 
  Camera, 
  Clock, 
  ChevronRight,
  Menu,
  X,
  Video,
  Image,
  Upload,
  Crown,
  Star,
  Zap,
  ExternalLink,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [activeCategory, setActiveCategory] = useState('all');
  const [posts, setPosts] = useState([]);
  const [trendingContent, setTrendingContent] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [privacyLevel, setPrivacyLevel] = useState('friends');
  const [selectedCategory, setSelectedCategory] = useState('news');
  const [contentType, setContentType] = useState('text');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const categories = [
    { id: 'all', name: 'All', icon: Globe, color: 'text-gray-700', bg: 'bg-gray-100' },
    { id: 'news', name: 'News', icon: Clock, color: 'text-blue-700', bg: 'bg-blue-50' },
    { id: 'politics', name: 'Politics', icon: Building, color: 'text-indigo-700', bg: 'bg-indigo-50' },
    { id: 'economy', name: 'Economy', icon: TrendingUp, color: 'text-green-700', bg: 'bg-green-50' },
    { id: 'sports', name: 'Sports', icon: Trophy, color: 'text-orange-700', bg: 'bg-orange-50' },
    { id: 'entertainment', name: 'Entertainment', icon: PlayCircle, color: 'text-purple-700', bg: 'bg-purple-50' },
    { id: 'technology', name: 'Technology', icon: Settings, color: 'text-cyan-700', bg: 'bg-cyan-50' },
    { id: 'health', name: 'Health', icon: Heart, color: 'text-pink-700', bg: 'bg-pink-50' },
    { id: 'culture', name: 'Culture', icon: Camera, color: 'text-amber-700', bg: 'bg-amber-50' }
  ];

  const contentTypes = [
    { id: 'text', name: 'Article', icon: Clock, description: 'Write an article or post' },
    { id: 'photo', name: 'Photo', icon: Image, description: 'Share photos' },
    { id: 'video', name: 'Video', icon: Video, description: 'Upload videos' },
    { id: 'short', name: 'Short', icon: Zap, description: 'Create short-form content' }
  ];

  const subscriptionPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: ['Basic posting', 'Limited media uploads', 'Community access', 'Standard privacy controls'],
      buttonText: 'Current Plan',
      current: true
    },
    {
      name: 'Creator',
      price: '$9',
      period: 'month',
      features: ['Unlimited posts', 'HD video uploads', 'Advanced analytics', 'Priority support', 'Custom branding'],
      buttonText: 'Upgrade',
      popular: true
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'month',
      features: ['Everything in Creator', 'Live streaming', 'Monetization tools', 'API access', 'White-label options'],
      buttonText: 'Upgrade'
    }
  ];

  const privacyLevels = [
    { value: 'public', label: 'Public', icon: Globe },
    { value: 'subscribers', label: 'Subscribers Only', icon: Crown },
    { value: 'friends', label: 'Friends', icon: UserCheck },
    { value: 'family', label: 'Family', icon: Heart },
    { value: 'professional', label: 'Professional', icon: Building },
    { value: 'private', label: 'Private', icon: Lock }
  ];

  useEffect(() => {
    setCurrentUser({
      id: 1,
      name: 'Demo User',
      email: 'demo@chhimeki.com',
      avatar: 'DU',
      subscription: 'free',
      followers: 1250,
      following: 340
    });

    setPosts([
      {
        id: 1,
        author: 'Sarah Chen',
        avatar: 'SC',
        title: 'The Future of Social Media Privacy',
        content: 'As we navigate an increasingly connected world, the importance of digital privacy cannot be overstated. Recent policy changes are reshaping how platforms handle user data, and creators need to understand these implications for their content and audience.',
        timestamp: '2 hours ago',
        readTime: '3 min read',
        likes: 124,
        comments: 18,
        shares: 23,
        privacy: 'public',
        category: 'news',
        type: 'text',
        trending: true,
        isBreaking: true,
        isPremium: false
      },
      {
        id: 2,
        author: 'Tech Insider',
        avatar: 'TI',
        title: 'Behind the Scenes: Creating Viral Content',
        content: 'Learn the secrets of viral content creation from top creators.',
        timestamp: '3 hours ago',
        readTime: '5 min watch',
        likes: 89,
        comments: 12,
        shares: 45,
        privacy: 'subscribers',
        category: 'technology',
        type: 'video',
        isPremium: true,
        media: {
          type: 'video',
          thumbnail: '🎬',
          duration: '5:23'
        }
      },
      {
        id: 3,
        author: 'Sports Weekly',
        avatar: 'SW',
        title: 'World Cup Highlights',
        content: 'Amazing goals and incredible saves from yesterday\'s match!',
        timestamp: '5 hours ago',
        readTime: '30 sec',
        likes: 267,
        comments: 45,
        shares: 89,
        privacy: 'public',
        category: 'sports',
        type: 'short',
        trending: true,
        media: {
          type: 'short',
          thumbnail: '⚽',
          duration: '0:30'
        }
      },
      {
        id: 4,
        author: 'Food Explorer',
        avatar: 'FE',
        title: 'Street Food Adventure in Tokyo',
        content: 'Discovering hidden gems in Tokyo\'s food scene. Each bite tells a story of tradition and innovation.',
        timestamp: '6 hours ago',
        readTime: '2 min read',
        likes: 156,
        comments: 34,
        shares: 12,
        privacy: 'public',
        category: 'culture',
        type: 'photo',
        media: {
          type: 'photo',
          thumbnail: '🍜',
          count: 8
        }
      }
    ]);

    setTrendingContent([
      {
        platform: 'TikTok',
        title: 'Climate Change Explained in 60 Seconds',
        author: '@sciencegirl',
        views: '2.3M',
        thumbnail: '🌍'
      },
      {
        platform: 'Twitter',
        title: 'Breaking: New AI Breakthrough Announced',
        author: '@techcrunch',
        views: '890K',
        thumbnail: '🤖'
      },
      {
        platform: 'Facebook',
        title: 'Heartwarming Rescue Story Goes Viral',
        author: 'Good News Network',
        views: '1.5M',
        thumbnail: '🐕'
      },
      {
        platform: 'YouTube',
        title: 'How to Build Your First App',
        author: 'Code Academy',
        views: '650K',
        thumbnail: '💻'
      }
    ]);

    setCommunities([
      { id: 1, name: 'Global News Hub', members: 45672, category: 'news', isJoined: true, isPremium: false },
      { id: 2, name: 'Tech Innovators Pro', members: 23456, category: 'technology', isJoined: true, isPremium: true },
      { id: 3, name: 'Sports Central', members: 67890, category: 'sports', isJoined: false, isPremium: false },
      { id: 4, name: 'Creator Economy', members: 12345, category: 'economy', isJoined: true, isPremium: true }
    ]);

    setRelationships([
      { id: 1, name: 'Emma Wilson', avatar: 'EW', relationship: 'Close Friend', category: 'friends', visibility: 'public' },
      { id: 2, name: 'David Doe', avatar: 'DD', relationship: 'Brother', category: 'family', visibility: 'private' },
      { id: 3, name: 'Lisa Zhang', avatar: 'LZ', relationship: 'Colleague', category: 'professional', visibility: 'professional' }
    ]);
  }, []);

  const handleCreatePost = () => {
    if ((newPost.trim() || contentType !== 'text') && postTitle.trim()) {
      const post = {
        id: posts.length + 1,
        author: currentUser.name,
        avatar: currentUser.avatar,
        title: postTitle,
        content: contentType === 'text' ? newPost : 'New ' + contentType + ' content uploaded.',
        timestamp: 'Just now',
        readTime: contentType === 'text' ? '1 min read' : contentType === 'short' ? '30 sec' : '2 min watch',
        likes: 0,
        comments: 0,
        shares: 0,
        privacy: privacyLevel,
        category: selectedCategory,
        type: contentType,
        isPremium: privacyLevel === 'subscribers',
        media: contentType !== 'text' ? {
          type: contentType,
          thumbnail: contentType === 'photo' ? '📸' : contentType === 'video' ? '🎥' : '⚡',
          duration: contentType === 'short' ? '0:30' : contentType === 'video' ? '2:15' : null,
          count: contentType === 'photo' ? 1 : null
        } : null
      };
      setPosts([post, ...posts]);
      setNewPost('');
      setPostTitle('');
    }
  };

  const getPrivacyIcon = (privacy) => {
    const level = privacyLevels.find(p => p.value === privacy);
    return level ? level.icon : Globe;
  };

  const getCategoryStyle = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category || { color: 'text-gray-700', bg: 'bg-gray-100' };
  };

  const filteredPosts = activeCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  const filteredCommunities = activeCategory === 'all'
    ? communities
    : communities.filter(community => community.category === activeCategory);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Chhimeki</h1>
            <p className="text-gray-600 text-lg">Create, Share, Connect</p>
          </div>
          
          <button 
            onClick={() => setCurrentUser({ id: 1, name: 'Demo User', avatar: 'DU', subscription: 'free', followers: 1250, following: 340 })}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200"
          >
            Start Creating
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Chhimeki</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {['home', 'trending', 'communities', 'relationships'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`font-medium transition-colors duration-200 ${
                    activeTab === tab
                      ? 'text-orange-600 border-b-2 border-orange-600 pb-4'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowSubscriptionModal(true)}
                className="hidden md:flex items-center space-x-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:shadow-lg transition-all"
              >
                <Crown className="w-4 h-4" />
                <span>Upgrade</span>
              </button>
              
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              {/* User Avatar */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {currentUser.avatar}
                </div>
                {currentUser.subscription === 'pro' && <Crown className="w-4 h-4 text-yellow-500" />}
              </div>

              {/* Mobile menu button */}
              <button 
                className="md:hidden p-2 text-gray-600"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-2">
                {['home', 'trending', 'communities', 'relationships'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left py-2 px-4 rounded-lg font-medium transition-colors ${
                      activeTab === tab
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
                <button 
                  onClick={() => setShowSubscriptionModal(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-medium mt-2"
                >
                  <Crown className="w-4 h-4" />
                  <span>Upgrade Plan</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Category Filter */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? `${category.bg} ${category.color} border border-current`
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                  {category.id !== 'all' && (
                    <span className="text-xs bg-white bg-opacity-60 px-2 py-0.5 rounded-full">
                      {filteredPosts.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-3">
              {/* Create Post */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                    {currentUser.avatar}
                  </div>
                  <div className="flex-1">
                    {/* Content Type Selector */}
                    <div className="flex items-center space-x-2 mb-4">
                      {contentTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setContentType(type.id)}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            contentType === type.id
                              ? 'bg-orange-100 text-orange-700 border border-orange-200'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <type.icon className="w-4 h-4" />
                          <span>{type.name}</span>
                        </button>
                      ))}
                    </div>

                    {/* Title Input */}
                    <input
                      type="text"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      placeholder="Give your post a title..."
                      className="w-full p-3 border border-gray-200 rounded-lg mb-3 font-medium text-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />

                    {/* Content Input */}
                    {contentType === 'text' ? (
                      <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="Tell your story..."
                        className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                        rows="4"
                      />
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">
                          {contentType === 'photo' && 'Upload photos or drag and drop'}
                          {contentType === 'video' && 'Upload video or drag and drop'}
                          {contentType === 'short' && 'Upload short video (max 60 seconds)'}
                        </p>
                        <button className="mt-2 text-orange-600 hover:text-orange-700 font-medium">
                          Choose files
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-4">
                        <select
                          value={privacyLevel}
                          onChange={(e) => setPrivacyLevel(e.target.value)}
                          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                        >
                          {privacyLevels.map(level => (
                            <option key={level.value} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                        >
                          {categories.filter(c => c.id !== 'all').map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={handleCreatePost}
                        disabled={!postTitle.trim()}
                        className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Publish
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Posts */}
              <div className="space-y-8">
                {filteredPosts.map(post => {
                  const PrivacyIcon = getPrivacyIcon(post.privacy);
                  const categoryStyle = getCategoryStyle(post.category);
                  
                  return (
                    <article key={post.id} className="bg-white border-b border-gray-200 pb-8 last:border-b-0">
                      {/* Post Header */}
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                          {post.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-gray-900">{post.author}</h3>
                            {post.isPremium && <Crown className="w-4 h-4 text-yellow-500" />}
                            {post.trending && (
                              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                                Trending
                              </span>
                            )}
                            {post.isBreaking && (
                              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                                Breaking
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>{post.timestamp}</span>
                            <span>•</span>
                            <span>{post.readTime}</span>
                            <span>•</span>
                            <span className={`${categoryStyle.color} font-medium`}>
                              {categories.find(c => c.id === post.category)?.name}
                            </span>
                            {post.type !== 'text' && (
                              <>
                                <span>•</span>
                                <span className="flex items-center space-x-1">
                                  {post.type === 'photo' && <Image className="w-3 h-3" />}
                                  {post.type === 'video' && <Video className="w-3 h-3" />}
                                  {post.type === 'short' && <Zap className="w-3 h-3" />}
                                  <span className="capitalize">{post.type}</span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <PrivacyIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </div>
                      
                      {/* Post Content */}
                      <div className="ml-16">
                        <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                          {post.title}
                        </h2>

                        {/* Media Content */}
                        {post.media && (
                          <div className="mb-4">
                            {post.type === 'photo' && (
                              <div className="bg-gray-100 rounded-lg p-8 text-center">
                                <span className="text-4xl">{post.media.thumbnail}</span>
                                <p className="text-sm text-gray-600 mt-2">
                                  {post.media.count} photo{post.media.count > 1 ? 's' : ''}
                                </p>
                              </div>
                            )}
                            {(post.type === 'video' || post.type === 'short') && (
                              <div className="bg-gray-900 rounded-lg p-8 text-center relative">
                                <span className="text-4xl">{post.media.thumbnail}</span>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <button className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors">
                                    <Play className="w-6 h-6 text-white ml-1" />
                                  </button>
                                </div>
                                <p className="text-sm text-white mt-2">
                                  {post.media.duration}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {post.content && (
                          <p className="text-gray-700 text-lg leading-relaxed mb-6">
                            {post.content}
                          </p>
                        )}
                        
                        {/* Post Actions */}
                        <div className="flex items-center space-x-6">
                          <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors">
                            <Heart className="w-5 h-5" />
                            <span className="font-medium">{post.likes}</span>
                          </button>
                          <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                            <MessageCircle className="w-5 h-5" />
                            <span className="font-medium">{post.comments}</span>
                          </button>
                          <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                            <Share className="w-5 h-5" />
                            <span className="font-medium">{post.shares}</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* User Stats */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-white text-lg font-bold mx-auto mb-3">
                    {currentUser.avatar}
                  </div>
                  <h3 className="font-bold text-gray-900">{currentUser.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{currentUser.subscription} Plan</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="font-bold text-gray-900">{currentUser.followers}</p>
                    <p className="text-sm text-gray-600">Followers</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{currentUser.following}</p>
                    <p className="text-sm text-gray-600">Following</p>
                  </div>
                </div>
              </div>

              {/* Trending External Content */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4">Trending Everywhere</h3>
                <div className="space-y-4">
                  {trendingContent.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg hover:shadow-sm transition-shadow">
                      <div className="text-2xl">{item.thumbnail}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium text-gray-500 uppercase">{item.platform}</span>
                          <ExternalLink className="w-3 h-3 text-gray-400" />
                        </div>
                        <h4 className="font-medium text-gray-900 text-sm leading-tight mb-1">{item.title}</h4>
                        <p className="text-xs text-gray-600">{item.author} • {item.views} views</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy Status */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4">Privacy</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Profile</span>
                    <span className="text-sm font-medium text-blue-600">Friends Only</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Posts</span>
                    <span className="text-sm font-medium text-green-600">Selective</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Media</span>
                    <span className="text-sm font-medium text-orange-600">Subscribers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trending Tab */}
        {activeTab === 'trending' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Trending Content</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Platform Trending */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">On Chhimeki</h3>
                <div className="space-y-4">
                  {posts.filter(p => p.trending).map(post => (
                    <div key={post.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {post.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{post.author}</p>
                          <p className="text-sm text-gray-500">{post.timestamp}</p>
                        </div>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">{post.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{post.likes} likes</span>
                        <span>{post.comments} comments</span>
                        <span>{post.shares} shares</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* External Trending */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Across Platforms</h3>
                <div className="space-y-4">
                  {trendingContent.map((item, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start space-x-3">
                        <div className="text-3xl">{item.thumbnail}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded">{item.platform}</span>
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{item.author}</p>
                          <p className="text-sm font-medium text-green-600">{item.views} views</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Communities Tab */}
        {activeTab === 'communities' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Communities</h2>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Create Community
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities.map(community => (
                <div key={community.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-12 h-12 ${getCategoryStyle(community.category).bg} rounded-lg flex items-center justify-center`}>
                      <Users className={`w-6 h-6 ${getCategoryStyle(community.category).color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-gray-900">{community.name}</h3>
                        {community.isPremium && <Crown className="w-4 h-4 text-yellow-500" />}
                      </div>
                      <p className="text-sm text-gray-500">{community.members.toLocaleString()} members</p>
                    </div>
                  </div>
                  <button 
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      community.isJoined 
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}
                  >
                    {community.isJoined ? 'Joined' : community.isPremium ? 'Subscribe to Join' : 'Join'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Relationships Tab */}
        {activeTab === 'relationships' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Relationships</h2>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Add Connection
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relationships.map(relationship => (
                <div key={relationship.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white font-medium">
                      {relationship.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{relationship.name}</h3>
                      <p className="text-gray-600">{relationship.relationship}</p>
                    </div>
                    {relationship.visibility === 'private' ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium capitalize">{relationship.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Visibility:</span>
                      <span className="font-medium capitalize">{relationship.visibility}</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors">
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
                <button 
                  onClick={() => setShowSubscriptionModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">Unlock powerful features to grow your audience and monetize your content</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan, index) => (
                  <div key={index} className={`relative border-2 rounded-xl p-6 ${
                    plan.popular 
                      ? 'border-orange-500 bg-orange-50' 
                      : plan.current 
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-white'
                  }`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-gray-600">/{plan.period}</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-2">
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs">✓</span>
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button 
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                        plan.current
                          ? 'bg-green-100 text-green-700 cursor-default'
                          : plan.popular
                            ? 'bg-orange-500 hover:bg-orange-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                      disabled={plan.current}
                    >
                      {plan.buttonText}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
