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
  Menu
} from 'lucide-react';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [activeCategory, setActiveCategory] = useState('all');
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [privacyLevel, setPrivacyLevel] = useState('friends');
  const [selectedCategory, setSelectedCategory] = useState('news');

  // News categories with BBC-style colors
  const categories = [
    { id: 'all', name: 'All', icon: Globe, color: 'bg-gray-700', textColor: 'text-gray-700' },
    { id: 'news', name: 'News', icon: Clock, color: 'bg-red-600', textColor: 'text-red-600' },
    { id: 'politics', name: 'Politics', icon: Building, color: 'bg-blue-700', textColor: 'text-blue-700' },
    { id: 'economy', name: 'Economy', icon: TrendingUp, color: 'bg-green-600', textColor: 'text-green-600' },
    { id: 'sports', name: 'Sports', icon: Trophy, color: 'bg-orange-600', textColor: 'text-orange-600' },
    { id: 'entertainment', name: 'Entertainment', icon: PlayCircle, color: 'bg-purple-600', textColor: 'text-purple-600' },
    { id: 'technology', name: 'Technology', icon: Settings, color: 'bg-indigo-600', textColor: 'text-indigo-600' },
    { id: 'health', name: 'Health', icon: Heart, color: 'bg-pink-600', textColor: 'text-pink-600' },
    { id: 'culture', name: 'Culture', icon: Camera, color: 'bg-yellow-600', textColor: 'text-yellow-600' }
  ];

  const privacyLevels = [
    { value: 'public', label: 'Public', icon: Globe, description: 'Everyone can see' },
    { value: 'friends', label: 'Friends', icon: UserCheck, description: 'Friends only' },
    { value: 'family', label: 'Family', icon: Heart, description: 'Family members only' },
    { value: 'professional', label: 'Professional', icon: Building, description: 'Professional network' },
    { value: 'private', label: 'Private', icon: Lock, description: 'Only you' }
  ];

  // Initialize demo data
  useEffect(() => {
    setCurrentUser({
      id: 1,
      name: 'Demo User',
      email: 'demo@chhimeki.com',
      avatar: '👤',
      relationshipStatus: 'private'
    });

    setPosts([
      {
        id: 1,
        author: 'Sarah Chen',
        avatar: '👩‍💼',
        content: 'BREAKING: Major policy changes announced affecting social media platforms. Industry experts predict significant impact on user privacy and data protection.',
        timestamp: '2 hours ago',
        likes: 124,
        comments: 18,
        privacy: 'public',
        category: 'news',
        community: 'Global News Hub',
        trending: true,
        isBreaking: true
      },
      {
        id: 2,
        author: 'Michael Kumar',
        avatar: '👨‍💻',
        content: 'Stock markets rally as tech giants report strong Q4 earnings. Social media and AI companies leading the charge with unprecedented growth.',
        timestamp: '3 hours ago',
        likes: 89,
        comments: 12,
        privacy: 'professional',
        category: 'economy',
        relationship: 'Professional Network'
      },
      {
        id: 3,
        author: 'Priya Sharma',
        avatar: '👩‍🎤',
        content: 'World Cup Final: What an incredible match! The atmosphere was electric and the performance was absolutely spectacular. History in the making!',
        timestamp: '5 hours ago',
        likes: 267,
        comments: 45,
        privacy: 'public',
        category: 'sports',
        trending: true
      },
      {
        id: 4,
        author: 'David Wilson',
        avatar: '👨‍🏫',
        content: 'Election Update: Record voter turnout reported across key constituencies. Early results showing tight race in several critical districts.',
        timestamp: '6 hours ago',
        likes: 156,
        comments: 34,
        privacy: 'public',
        category: 'politics',
        isBreaking: true
      },
      {
        id: 5,
        author: 'Lisa Zhang',
        avatar: '👩‍🎨',
        content: 'Movie premiere review: The cinematography is breathtaking and the storyline captivating. This film will definitely be in the running for major awards.',
        timestamp: '8 hours ago',
        likes: 78,
        comments: 23,
        privacy: 'public',
        category: 'entertainment'
      },
      {
        id: 6,
        author: 'Emma Wilson',
        avatar: '👩‍🦱',
        content: 'Celebrating our cultural heritage during festival season. Family traditions connecting generations and preserving our beautiful customs.',
        timestamp: '1 day ago',
        likes: 92,
        comments: 15,
        privacy: 'family',
        category: 'culture',
        relationship: 'Family Circle'
      }
    ]);

    setCommunities([
      { id: 1, name: 'Global News Hub', members: 45672, description: 'Breaking news and current affairs worldwide', category: 'news', isJoined: true },
      { id: 2, name: 'Tech Innovators', members: 23456, description: 'Latest in technology and innovation', category: 'technology', isJoined: true },
      { id: 3, name: 'Sports Central', members: 67890, description: 'All sports coverage and discussions', category: 'sports', isJoined: false },
      { id: 4, name: 'Political Forum', members: 12345, description: 'Civil political discourse and analysis', category: 'politics', isJoined: true },
      { id: 5, name: 'Entertainment Today', members: 34567, description: 'Movies, music, and celebrity news', category: 'entertainment', isJoined: false }
    ]);

    setRelationships([
      { id: 1, name: 'Emma Wilson', avatar: '👩‍🦱', relationship: 'Close Friend', category: 'friends', visibility: 'public' },
      { id: 2, name: 'David Doe', avatar: '👨‍🦲', relationship: 'Brother', category: 'family', visibility: 'private' },
      { id: 3, name: 'Lisa Zhang', avatar: '👩‍💻', relationship: 'Colleague', category: 'professional', visibility: 'professional' }
    ]);
  }, []);

  const handleCreatePost = () => {
    if (newPost.trim()) {
      const post = {
        id: posts.length + 1,
        author: currentUser.name,
        avatar: currentUser.avatar,
        content: newPost,
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        privacy: privacyLevel,
        category: selectedCategory
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  const getPrivacyIcon = (privacy) => {
    const level = privacyLevels.find(p => p.value === privacy);
    return level ? level.icon : Globe;
  };

  const getPrivacyColor = (privacy) => {
    const colors = {
      public: 'text-green-600',
      friends: 'text-blue-600',
      family: 'text-red-600',
      professional: 'text-purple-600',
      private: 'text-gray-600'
    };
    return colors[privacy] || 'text-gray-600';
  };

  const getCategoryStyle = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category || { color: 'bg-gray-600', textColor: 'text-gray-600' };
  };

  const filteredPosts = activeCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  const filteredCommunities = activeCategory === 'all'
    ? communities
    : communities.filter(community => community.category === activeCategory);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center">
            <div className="bg-gradient-to-r from-red-600 to-gray-800 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Chhimeki</h1>
            <p className="text-gray-600 mb-8">Your trusted social news platform</p>
            <button 
              onClick={() => setCurrentUser({ id: 1, name: 'Demo User', avatar: '👤' })}
              className="w-full bg-gradient-to-r from-red-600 to-gray-800 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Enter Demo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - BBC News Style */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          {/* Top Navigation */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-red-600 to-gray-800 w-12 h-12 rounded-lg flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Chhimeki</h1>
                <p className="text-sm text-gray-500 hidden md:block">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            {/* Breaking News Ticker */}
            <div className="hidden lg:flex items-center bg-red-600 text-white px-4 py-2 rounded-full animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
              <span className="font-bold text-sm">LIVE: Election Updates • Tech Summit • Sports Finals</span>
            </div>

            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                <Search className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                <Bell className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                <Settings className="w-6 h-6" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-gray-800 rounded-full flex items-center justify-center text-white font-bold">
                {currentUser.avatar}
              </div>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-1">
              {['home', 'communities', 'relationships'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 ${
                    activeTab === tab
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab === 'home' && <Home className="w-5 h-5" />}
                  {tab === 'communities' && <Users className="w-5 h-5" />}
                  {tab === 'relationships' && <Heart className="w-5 h-5" />}
                  <span className="capitalize">{tab}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-2 py-4 overflow-x-auto">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? `${category.color} text-white shadow-lg transform scale-105`
                      : `text-gray-600 hover:bg-gray-100 hover:${category.textColor}`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                  {category.id !== 'all' && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isActive ? 'bg-white bg-opacity-25' : 'bg-gray-200'
                    }`}>
                      {filteredPosts.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'home' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Feed */}
            <div className="lg:col-span-3 space-y-6">
              {/* Category Header */}
              {activeCategory !== 'all' && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-red-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 capitalize">
                        {categories.find(c => c.id === activeCategory)?.name}
                      </h2>
                      <p className="text-gray-600 mt-1">{filteredPosts.length} posts</p>
                    </div>
                    <div className={`w-16 h-16 ${getCategoryStyle(activeCategory).color} rounded-2xl flex items-center justify-center`}>
                      {React.createElement(categories.find(c => c.id === activeCategory)?.icon, {
                        className: "w-8 h-8 text-white"
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Create Post */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-gray-800 rounded-full flex items-center justify-center text-white font-bold">
                    {currentUser.avatar}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="Share breaking news, insights, or updates..."
                      className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
                      rows="3"
                    />
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-5 h-5 text-gray-400" />
                          <select
                            value={privacyLevel}
                            onChange={(e) => setPrivacyLevel(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                          >
                            {privacyLevels.map(level => (
                              <option key={level.value} value={level.value}>
                                {level.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500 font-medium">Category:</span>
                          <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                          >
                            {categories.filter(c => c.id !== 'all').map(category => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <button
                        onClick={handleCreatePost}
                        disabled={!newPost.trim()}
                        className="bg-gradient-to-r from-red-600 to-gray-800 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Posts Feed */}
              {filteredPosts.map(post => {
                const PrivacyIcon = getPrivacyIcon(post.privacy);
                const categoryStyle = getCategoryStyle(post.category);
                
                return (
                  <article key={post.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-14 h-14 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                          {post.avatar}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-bold text-gray-900 text-lg">{post.author}</h3>
                            {post.trending && (
                              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                                TRENDING
                              </span>
                            )}
                            {post.isBreaking && (
                              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                BREAKING
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span className="font-medium">{post.timestamp}</span>
                            <span>•</span>
                            <span className={`${categoryStyle.color} text-white px-2 py-1 rounded-lg text-xs font-bold`}>
                              {categories.find(c => c.id === post.category)?.name}
                            </span>
                            {post.community && (
                              <>
                                <span>•</span>
                                <span className="text-blue-600 font-medium">{post.community}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className={`flex items-center ${getPrivacyColor(post.privacy)}`}>
                        <PrivacyIcon className="w-5 h-5" />
                      </div>
                    </div>
                    
                    <p className="text-gray-800 text-lg leading-relaxed mb-6">{post.content}</p>
                    
                    <div className="flex items-center space-x-8 pt-4 border-t border-gray-100">
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
                        <Heart className="w-6 h-6" />
                        <span className="font-bold text-lg">{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                        <MessageCircle className="w-6 h-6" />
                        <span className="font-bold text-lg">{post.comments}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
                        <Share className="w-6 h-6" />
                        <span className="font-bold">Share</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Trending Topics */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 text-xl mb-4 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-red-600" />
                  Trending Now
                </h3>
                <div className="space-y-4">
                  {[
                    { tag: '#Election2024', posts: '245K' },
                    { tag: '#TechSummit', posts: '189K' },
                    { tag: '#WorldCup', posts: '356K' },
                    { tag: '#ClimateAction', posts: '127K' }
                  ].map((trend, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="font-bold text-gray-800">{trend.tag}</span>
                      <span className="text-sm text-gray-500 font-medium">{trend.posts} posts</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy Dashboard */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 text-xl mb-4 flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-green-600" />
                  Privacy Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Profile Visibility</span>
                    <span className="font-bold text-blue-600">Friends Only</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Relationship Status</span>
                    <span className="font-bold text-red-600">Private</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Professional Info</span>
                    <span className="font-bold text-purple-600">Network Only</span>
                  </div>
                </div>
              </div>

              {/* Your Communities */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 text-xl mb-4">Your Communities</h3>
                <div className="space-y-3">
                  {filteredCommunities.filter(c => c.isJoined).map(community => (
                    <div key={community.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                      <div className={`w-10 h-10 ${getCategoryStyle(community.category).color} rounded-xl flex items-center justify-center`}>
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{community.name}</p>
                        <p className="text-sm text-gray-500">{community.members.toLocaleString()} members</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Communities Tab */}
        {activeTab === 'communities' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-bold text-gray-900">Communities</h2>
              <button className="bg-gradient-to-r from-red-600 to-gray-800 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Create Community</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities.map(community => (
                <div key={community.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-16 h-16 ${getCategoryStyle(community.category).color} rounded-2xl flex items-center justify-center`}>
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-xl">{community.name}</h3>
                      <span className={`text-sm px-3 py-1 rounded-full text-white ${getCategoryStyle(community.category).color}`}>
                        {community.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{community.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-bold">{community.members.toLocaleString()} members</span>
                    <button 
                      className={`px-6 py-2 rounded-xl font-bold transition-all duration-200 ${
                        community.isJoined 
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                          : 'bg-gradient-to-r from-red-600 to-gray-800 text-white hover:shadow-lg transform hover:scale-105'
                      }`}
                    >
                      {community.isJoined ? 'Joined' : 'Join'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Relationships Tab */}
        {activeTab === 'relationships' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-bold text-gray-900">Relationship Hierarchy</h2>
              <button className="bg-gradient-to-r from-red-600 to-gray-800 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center space-x-2">
