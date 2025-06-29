import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  Home, 
  Search, 
  Bell, 
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
  Menu,
  X,
  Video,
  Image,
  Upload,
  Crown,
  Zap,
  LogOut,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState('home');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [postTitle, setPostTitle] = useState('');

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'news', name: 'News' },
    { id: 'politics', name: 'Politics' },
    { id: 'economy', name: 'Economy' },
    { id: 'sports', name: 'Sports' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'technology', name: 'Technology' },
    { id: 'health', name: 'Health' },
    { id: 'culture', name: 'Culture' }
  ];

  useEffect(() => {
    const initApp = () => {
      const savedSession = localStorage.getItem('chhimeki_session');
      if (savedSession) {
        const userData = JSON.parse(savedSession);
        setCurrentUser(userData);
        setSession({ user: userData });
        loadDemoData();
      }
      setLoading(false);
    };

    setTimeout(initApp, 1000);
  }, []);

  const loadDemoData = () => {
    setPosts([
      {
        id: 1,
        author: 'Sarah Chen',
        avatar: 'SC',
        title: 'The Future of Social Media Privacy',
        content: 'As we navigate an increasingly connected world, the importance of digital privacy cannot be overstated.',
        timestamp: '2 hours ago',
        likes: 124,
        comments: 18,
        trending: true
      },
      {
        id: 2,
        author: 'Tech Insider',
        avatar: 'TI',
        title: 'Behind the Scenes: Creating Viral Content',
        content: 'Learn the secrets of viral content creation from top creators.',
        timestamp: '3 hours ago',
        likes: 89,
        comments: 12,
        isPremium: true
      }
    ]);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    setAuthSuccess('');

    if (authForm.password !== authForm.confirmPassword) {
      setAuthError('Passwords do not match');
      setAuthLoading(false);
      return;
    }

    if (authForm.password.length < 6) {
      setAuthError('Password must be at least 6 characters');
      setAuthLoading(false);
      return;
    }

    setTimeout(() => {
      setAuthSuccess('Account created! Please check your email for verification.');
      setAuthForm({ email: '', password: '', fullName: '', confirmPassword: '' });
      setAuthLoading(false);
    }, 1500);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    setTimeout(() => {
      if (authForm.email === 'demo@chhimeki.com' && authForm.password === 'demo123') {
        const userData = {
          id: 'demo_user_123',
          email: authForm.email,
          full_name: 'Demo User',
          avatar: 'DU',
          subscription_tier: 'free'
        };

        localStorage.setItem('chhimeki_session', JSON.stringify(userData));
        setCurrentUser(userData);
        setSession({ user: userData });
        setShowAuthModal(false);
        resetAuthForm();
        loadDemoData();
      } else {
        setAuthError('Invalid email or password');
      }
      setAuthLoading(false);
    }, 1000);
  };

  const handleSignOut = () => {
    localStorage.removeItem('chhimeki_session');
    setCurrentUser(null);
    setSession(null);
    setPosts([]);
  };

  const resetAuthForm = () => {
    setAuthForm({ email: '', password: '', fullName: '', confirmPassword: '' });
    setAuthError('');
    setAuthSuccess('');
  };

  const handleCreatePost = () => {
    if (!currentUser || !postTitle.trim()) return;

    const newPostData = {
      id: posts.length + 1,
      author: currentUser.full_name,
      avatar: currentUser.avatar,
      title: postTitle,
      content: newPost || 'New content uploaded.',
      timestamp: 'Just now',
      likes: 0,
      comments: 0
    };

    setPosts([newPostData, ...posts]);
    setNewPost('');
    setPostTitle('');
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

  if (!session) {
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
          
          <div className="space-y-4">
            <button 
              onClick={() => {
                setAuthMode('signin');
                setShowAuthModal(true);
                resetAuthForm();
              }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => {
                setAuthMode('signup');
                setShowAuthModal(true);
                resetAuthForm();
              }}
              className="w-full border border-orange-500 text-orange-500 hover:bg-orange-50 py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Create Account
            </button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Demo Account</h3>
            <p className="text-sm text-blue-700 mb-2">Try the platform with:</p>
            <div className="text-sm font-mono text-blue-800">
              <div>Email: demo@chhimeki.com</div>
              <div>Password: demo123</div>
            </div>
          </div>
        </div>

        {showAuthModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                </h2>
                <button 
                  onClick={() => {
                    setShowAuthModal(false);
                    resetAuthForm();
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={authMode === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={authForm.fullName}
                      onChange={(e) => setAuthForm({ ...authForm, fullName: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {authMode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      value={authForm.confirmPassword}
                      onChange={(e) => setAuthForm({ ...authForm, confirmPassword: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                )}

                {authError && (
                  <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-700 text-sm">{authError}</span>
                  </div>
                )}

                {authSuccess && (
                  <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-700 text-sm">{authSuccess}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-medium"
                >
                  {authLoading ? 'Please wait...' : authMode === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                    resetAuthForm();
                  }}
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  {authMode === 'signin' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
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
              {['home', 'trending', 'communities', 'relationships'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`font-medium transition-colors ${
                    activeTab === tab ? 'text-orange-600 border-b-2 border-orange-600 pb-4' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <button className="hidden md:flex items-center space-x-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                <Crown className="w-4 h-4" />
                <span>Upgrade</span>
              </button>
              
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {currentUser?.avatar}
                </div>
                <button onClick={handleSignOut} className="p-2 text-gray-600 hover:text-gray-900" title="Sign Out">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {currentUser?.avatar}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="Give your post a title..."
                    className="w-full p-3 border border-gray-200 rounded-lg mb-3 font-medium text-lg focus:ring-2 focus:ring-orange-500"
                  />

                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Tell your story..."
                    className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 text-lg"
                    rows="4"
                  />

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-orange-600">
                        <Image className="w-5 h-5" />
                        <span>Photo</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-orange-600">
                        <Video className="w-5 h-5" />
                        <span>Video</span>
                      </button>
                    </div>
                    <button
                      onClick={handleCreatePost}
                      disabled={!postTitle.trim()}
                      className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium"
                    >
                      Publish
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {posts.map(post => (
                <article key={post.id} className="bg-white border-b border-gray-200 pb-8">
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
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500">
                        <Heart className="w-5 h-5" />
                        <span className="font-medium">{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
                        <Users className="w-5 h-5" />
                        <span className="font-medium">{post.comments}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500">
                        <Share className="w-5 h-5" />
                        <span className="font-medium">Share</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-white text-lg font-bold mx-auto mb-3">
                  {currentUser?.avatar}
                </div>
                <h3 className="font-bold text-gray-900">{currentUser?.full_name}</h3>
                <p className="text-sm text-gray-600 capitalize">{currentUser?.subscription_tier} Plan</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="font-bold text-gray-900">1.2K</p>
                  <p className="text-sm text-gray-600">Followers</p>
                </div>
                <div>
                  <p className="font-bold text-gray-900">340</p>
                  <p className="text-sm text-gray-600">Following</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Trending</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">#TechNews</span>
                  <span className="text-sm text-gray-500">245K posts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">#Innovation</span>
                  <span className="text-sm text-gray-500">189K posts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">#Creator</span>
                  <span className="text-sm text-gray-500">156K posts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
