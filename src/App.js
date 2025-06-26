import React, { useState, useEffect } from 'react';
import { User, Users, MessageCircle, Shield, Settings, Home, Search, Bell, Plus, Eye, EyeOff, Heart, MessageSquare, Share, Lock, Globe, UserCheck, Building } from 'lucide-react';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [privacyLevel, setPrivacyLevel] = useState('friends');

  // Initialize demo data
  useEffect(() => {
    // Demo user
    setCurrentUser({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '👤',
      relationshipStatus: 'private'
    });

    // Demo posts
    setPosts([
      {
        id: 1,
        author: 'Sarah Chen',
        avatar: '👩',
        content: 'Just joined the Nepali Community! Excited to connect with everyone here.',
        timestamp: '2 hours ago',
        likes: 12,
        comments: 3,
        privacy: 'community',
        community: 'Nepali Community'
      },
      {
        id: 2,
        author: 'Michael Kumar',
        avatar: '👨',
        content: 'Looking for software engineering opportunities in the Bay Area. Anyone hiring?',
        timestamp: '4 hours ago',
        likes: 8,
        comments: 7,
        privacy: 'professional',
        relationship: 'Professional Network'
      },
      {
        id: 3,
        author: 'Priya Sharma',
        avatar: '👩‍💼',
        content: 'Family gathering was amazing! Thanks to everyone who made it special.',
        timestamp: '1 day ago',
        likes: 25,
        comments: 12,
        privacy: 'family',
        relationship: 'Family Circle'
      }
    ]);

    // Demo communities
    setCommunities([
      {
        id: 1,
        name: 'Nepali Community',
        members: 1247,
        description: 'Connect with Nepali people worldwide',
        category: 'Cultural',
        isJoined: true
      },
      {
        id: 2,
        name: 'Tech Professionals',
        members: 3456,
        description: 'Networking for technology professionals',
        category: 'Professional',
        isJoined: true
      },
      {
        id: 3,
        name: 'Local Neighborhood',
        members: 89,
        description: 'Your local community updates and events',
        category: 'Local',
        isJoined: false
      }
    ]);

    // Demo relationships
    setRelationships([
      {
        id: 1,
        name: 'Emma Wilson',
        avatar: '👩‍🦱',
        relationship: 'Close Friend',
        category: 'friends',
        visibility: 'public'
      },
      {
        id: 2,
        name: 'David Doe',
        avatar: '👨‍🦲',
        relationship: 'Brother',
        category: 'family',
        visibility: 'private'
      },
      {
        id: 3,
        name: 'Lisa Zhang',
        avatar: '👩‍💻',
        relationship: 'Colleague',
        category: 'professional',
        visibility: 'professional'
      }
    ]);
  }, []);

  const privacyLevels = [
    { value: 'public', label: 'Public', icon: Globe, description: 'Everyone can see' },
    { value: 'friends', label: 'Friends', icon: UserCheck, description: 'Friends only' },
    { value: 'family', label: 'Family', icon: Heart, description: 'Family members only' },
    { value: 'professional', label: 'Professional', icon: Building, description: 'Professional network' },
    { value: 'private', label: 'Private', icon: Lock, description: 'Only you' }
  ];

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
        privacy: privacyLevel
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

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Chhimeki</h1>
            <p className="text-gray-600 mt-2">Your privacy-first social platform</p>
          </div>
          
          <button 
            onClick={() => setCurrentUser({ id: 1, name: 'Demo User', avatar: '👤' })}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
          >
            Enter Demo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-10 h-10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">Chhimeki</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => setActiveTab('home')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'home' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>
              <button 
                onClick={() => setActiveTab('communities')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'communities' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Users className="w-5 h-5" />
                <span>Communities</span>
              </button>
              <button 
                onClick={() => setActiveTab('relationships')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'relationships' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Heart className="w-5 h-5" />
                <span>Relationships</span>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {currentUser.avatar}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Home Feed */}
        {activeTab === 'home' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
              {/* Create Post */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {currentUser.avatar}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="What's on your mind?"
                      className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                    />
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-gray-400" />
                        <select
                          value={privacyLevel}
                          onChange={(e) => setPrivacyLevel(e.target.value)}
                          className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500"
                        >
                          {privacyLevels.map(level => (
                            <option key={level.value} value={level.value}>
                              {level.label} - {level.description}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={handleCreatePost}
                        disabled={!newPost.trim()}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Posts */}
              {posts.map(post => {
                const PrivacyIcon = getPrivacyIcon(post.privacy);
                return (
                  <div key={post.id} className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {post.avatar}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{post.author}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>{post.timestamp}</span>
                            {post.community && (
                              <>
                                <span>•</span>
                                <span className="text-blue-600">{post.community}</span>
                              </>
                            )}
                            {post.relationship && (
                              <>
                                <span>•</span>
                                <span className="text-purple-600">{post.relationship}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className={`flex items-center space-x-1 ${getPrivacyColor(post.privacy)}`}>
                        <PrivacyIcon className="w-4 h-4" />
                      </div>
                    </div>
                    
                    <p className="text-gray-800 mb-4">{post.content}</p>
                    
                    <div className="flex items-center space-x-6 pt-4 border-t border-gray-100">
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                        <Heart className="w-5 h-5" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                        <Share className="w-5 h-5" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Privacy Status */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Privacy Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profile Visibility</span>
                    <span className="text-sm font-medium text-blue-600">Friends Only</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Relationship Status</span>
                    <span className="text-sm font-medium text-red-600">Private</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Professional Info</span>
                    <span className="text-sm font-medium text-purple-600">Network Only</span>
                  </div>
                </div>
              </div>

              {/* Active Communities */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Your Communities</h3>
                <div className="space-y-3">
                  {communities.filter(c => c.isJoined).map(community => (
                    <div key={community.id} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{community.name}</p>
                        <p className="text-xs text-gray-500">{community.members} members</p>
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
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Communities</h2>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Create Community</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communities.map(community => (
                <div key={community.id} className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{community.name}</h3>
                      <span className="text-sm text-gray-500">{community.category}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{community.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{community.members} members</span>
                    <button 
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                        community.isJoined 
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
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
              <h2 className="text-2xl font-bold text-gray-800">Relationship Hierarchy</h2>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Add Connection</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relationships.map(relationship => (
                <div key={relationship.id} className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {relationship.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{relationship.name}</h3>
                        <span className="text-sm text-gray-500">{relationship.relationship}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {relationship.visibility === 'private' ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Category:</span>
                      <span className={`font-medium capitalize ${
                        relationship.category === 'family' ? 'text-red-600' :
                        relationship.category === 'friends' ? 'text-blue-600' :
                        'text-purple-600'
                      }`}>
                        {relationship.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Visibility:</span>
                      <span className="font-medium capitalize text-gray-800">
                        {relationship.visibility}
                      </span>
                    </div>
                  </div>
                  
                  <button className="w-full mt-4 bg-gray-100 text-gray-600 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                    Edit Relationship
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center space-y-1 py-2 ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button 
            onClick={() => setActiveTab('communities')}
            className={`flex flex-col items-center space-y-1 py-2 ${activeTab === 'communities' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs">Communities</span>
          </button>
          <button 
            onClick={() => setActiveTab('relationships')}
            className={`flex flex-col items-center space-y-1 py-2 ${activeTab === 'relationships' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <Heart className="w-6 h-6" />
            <span className="text-xs">Relationships</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
