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
  ChevronRight
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

  const categories = [
    { id: 'all', name: 'All', icon: Globe, color: 'bg-gray-700' },
    { id: 'news', name: 'News', icon: Clock, color: 'bg-red-600' },
    { id: 'politics', name: 'Politics', icon: Building, color: 'bg-blue-700' },
    { id: 'economy', name: 'Economy', icon: TrendingUp, color: 'bg-green-600' },
    { id: 'sports', name: 'Sports', icon: Trophy, color: 'bg-orange-600' },
    { id: 'entertainment', name: 'Entertainment', icon: PlayCircle, color: 'bg-purple-600' },
    { id: 'technology', name: 'Technology', icon: Settings, color: 'bg-indigo-600' },
    { id: 'health', name: 'Health', icon: Heart, color: 'bg-pink-600' },
    { id: 'culture', name: 'Culture', icon: Camera, color: 'bg-yellow-600' }
  ];

  const privacyLevels = [
    { value: 'public', label: 'Public', icon: Globe },
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
      avatar: '👤'
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
        category: 'economy'
      },
      {
        id: 3,
        author: 'Priya Sharma',
        avatar: '👩‍🎤',
        content: 'World Cup Final: What an incredible match! The atmosphere was electric and the performance was absolutely spectacular.',
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
        content: 'Election Update: Record voter turnout reported across key constituencies. Early results showing tight race in several districts.',
        timestamp: '6 hours ago',
        likes: 156,
        comments: 34,
        privacy: 'public',
        category: 'politics',
        isBreaking: true
      }
    ]);

    setCommunities([
      { id: 1, name: 'Global News Hub', members: 45672, category: 'news', isJoined: true },
      { id: 2, name: 'Tech Innovators', members: 23456, category: 'technology', isJoined: true },
      { id: 3, name: 'Sports Central', members: 67890, category: 'sports', isJoined: false },
      { id: 4, name: 'Political Forum', members: 12345, category: 'politics', isJoined: true }
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
    return category || { color: 'bg-gray-600' };
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
              className="w-full bg-gradient-to-r from-red-600 to-gray-800 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all duration-300"
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
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
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
            
            <div className="hidden lg:flex items-center bg-red-600 text-white px-4 py-2 rounded-full animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
              <span className="font-bold text-sm">LIVE: Election Updates • Tech Summit • Sports Finals</span>
            </div>

            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl">
                <Search className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl">
                <Bell className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl">
                <Settings className="w-6 h-6" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-gray-800 rounded-full flex items-center justify-center text-white font-bold">
                {currentUser.avatar}
              </div>
            </div>
          </div>

          <div className="flex items-center px-4 py-3">
            <div className="flex items-center space-x-1">
              {['home', 'communities', 'relationships'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${
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
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? `${category.color} text-white shadow-lg`
                      : 'text-gray-600 hover:bg-gray-100'
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
                      className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-red-500"
                      rows="3"
                    />
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-5 h-5 text-gray-400" />
                          <select
                            value={privacyLevel}
                            onChange={(e) => setPrivacyLevel(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2"
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
                            className="border border-gray-200 rounded-lg px-3 py-2"
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
                        className="bg-gradient-to-r from-red-600 to-gray-800 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Posts */}
              {filteredPosts.map(post => {
                const PrivacyIcon = getPrivacyIcon(post.privacy);
                const categoryStyle = getCategoryStyle(post.category);
                
                return (
                  <article key={post.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
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
                          </div>
                        </div>
                      </div>
                      <div className={`flex items-center ${getPrivacyColor(post.privacy)}`}>
                        <PrivacyIcon className="w-5 h-5" />
                      </div>
                    </div>
                    
                    <p className="text-gray-800 text-lg leading-relaxed mb-6">{post.content}</p>
                    
                    <div className="flex items-center space-x-8 pt-4 border-t border-gray-100">
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600">
                        <Heart className="w-6 h-6" />
                        <span className="font-bold text-lg">{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                        <MessageCircle className="w-6 h-6" />
                        <span className="font-bold text-lg">{post.comments}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600">
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
            </div>
          </div>
        )}

        {/* Communities Tab */}
        {activeTab === 'communities' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-bold text-gray-900">Communities</h2>
              <button className="bg-gradient-to-r from-red-600 to-gray-800 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2">
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
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-bold">{community.members.toLocaleString()} members</span>
                    <button 
                      className={`px-6 py-2 rounded-xl font-bold ${
                        community.isJoined 
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                          : 'bg-gradient-to-r from-red-600 to-gray-800 text-white'
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
              <button className="bg-gradient-to-r from-red-600 to-gray-800 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Add Connection</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relationships.map(relationship => (
                <div key={relationship.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-red-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {relationship.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-xl">{relationship.name}</h3>
                        <span className="text-gray-600">{relationship.relationship}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {relationship.visibility === 'private' ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className={`font-bold capitalize ${
                        relationship.category === 'family' ? 'text-red-600' :
                        relationship.category === 'friends' ? 'text-blue-600' :
                        'text-purple-600'
                      }`}>
                        {relationship.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Visibility:</span>
                      <span className="font-bold capitalize text-gray-800">
                        {relationship.visibility}
                      </span>
                    </div>
                  </div>
                  
                  <button className="w-full mt-6 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200">
                    Edit Relationship
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div className="flex justify-around">
          {[
            { tab: 'home', icon: Home, label: 'Home' },
            { tab: 'communities', icon: Users, label: 'Communities' },
            { tab: 'relationships', icon: Heart, label: 'Relationships' }
          ].map(({ tab, icon: Icon, label }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex flex-col items-center space-y-1 py-2 px-4 ${
                activeTab === tab ? 'text-red-600' : 'text-gray-400'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-bold">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default App;
