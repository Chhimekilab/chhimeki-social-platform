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

// Simulated Supabase client for demonstration
const simulatedSupabase = {
  auth: {
    getSession: async () => {
      const session = JSON.parse(localStorage.getItem('chhimeki_session') || 'null');
      return { data: { session } };
    },
    
    onAuthStateChange: (callback) => {
      // Simulate auth state changes
      const checkAuth = () => {
        const session = JSON.parse(localStorage.getItem('chhimeki_session') || 'null');
        callback('SIGNED_IN', session);
      };
      
      window.addEventListener('storage', checkAuth);
      return { data: { subscription: { unsubscribe: () => window.removeEventListener('storage', checkAuth) } } };
    },
    
    signUp: async ({ email, password, options }) => {
      // Simulate signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'test@example.com') {
        throw new Error('User already exists');
      }
      
      const user = {
        id: 'user_' + Date.now(),
        email,
        user_metadata: options?.data || {}
      };
      
      return { data: { user }, error: null };
    },
    
    signInWithPassword: async ({ email, password }) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo accounts
      const demoAccounts = {
        'demo@chhimeki.com': 'demo123',
        'user@example.com': 'password123'
      };
      
      if (demoAccounts[email] && demoAccounts[email] === password) {
        const user = {
          id: 'user_' + email.replace(/[^a-z0-9]/gi, '_'),
          email,
          user_metadata: {
            full_name: email === 'demo@chhimeki.com' ? 'Demo User' : 'Test User'
          }
        };
        
        const session = { user };
        localStorage.setItem('chhimeki_session', JSON.stringify(session));
        return { data: { session }, error: null };
      }
      
      throw new Error('Invalid email or password');
    },
    
    signOut: async () => {
      localStorage.removeItem('chhimeki_session');
      localStorage.removeItem('chhimeki_profile');
      localStorage.removeItem('chhimeki_posts');
      return { error: null };
    }
  },
  
  from: (table) => ({
    select: (columns) => ({
      eq: (column, value) => ({
        single: async () => {
          // Simulate database queries
          if (table === 'profiles') {
            const profile = JSON.parse(localStorage.getItem('chhimeki_profile') || 'null');
            if (profile && profile.id === value) {
              return { data: profile, error: null };
            }
            return { data: null, error: { code: 'PGRST116' } };
          }
          return { data: null, error: null };
        },
        limit: (num) => ({
          order: (column, options) => ({
            async: async () => {
              if (table === 'posts') {
                const posts = JSON.parse(localStorage.getItem('chhimeki_posts') || '[]');
                return { data: posts, error: null };
              }
              return { data: [], error: null };
            }
          })
        })
      }),
      order: (column, options) => ({
        limit: (num) => ({
          async: async () => {
            if (table === 'posts') {
              const posts = JSON.parse(localStorage.getItem('chhimeki_posts') || '[]');
              return { data: posts.slice(0, num), error: null };
            }
            return { data: [], error: null };
          }
        })
      })
    }),
    
    insert: (data) => ({
      select: (columns) => ({
        single: async () => {
          if (table === 'profiles') {
            const profile = { ...data, subscription_tier: 'free', followers_count: 0, following_count: 0 };
            localStorage.setItem('chhimeki_profile', JSON.stringify(profile));
            return { data: profile, error: null };
          }
          
          if (table === 'posts') {
            const posts = JSON.parse(localStorage.getItem('chhimeki_posts') || '[]');
            const newPost = {
              ...data,
              id: 'post_' + Date.now(),
              created_at: new Date().toISOString(),
              likes_count: 0,
              comments_count: 0,
              is_trending: false,
              is_premium: false,
              profiles: {
                full_name: JSON.parse(localStorage.getItem('chhimeki_profile') || '{}').full_name || 'User',
                subscription_tier: 'free'
              }
            };
            posts.unshift(newPost);
            localStorage.setItem('chhimeki_posts', JSON.stringify(posts));
            return { data: newPost, error: null };
          }
          
          return { data, error: null };
        }
      })
    })
  })
};

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
  const [postLoading, setPostLoading] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      // Initialize demo data if not exists
      if (!localStorage.getItem('chhimeki_posts')) {
        const demoPosts = [
          {
            id: 'post_1',
            author_id: 'demo_user',
            title: 'The Future of Social Media Privacy',
            content: 'As we navigate an increasingly connected world, the importance of digital privacy cannot be overstated. Here are my thoughts on building platforms that respect user data while fostering meaningful connections.',
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            likes_count: 124,
            comments_count: 18,
            is_trending: true,
            is_premium: false,
            profiles: {
              full_name: 'Sarah Chen',
              subscription_tier: 'premium'
            }
          },
          {
            id: 'post_2',
            author_id: 'tech_user',
            title: 'Behind the Scenes: Creating Viral Content',
            content: 'After creating content for over 5 years, I\'ve learned that viral content isn\'t about luck—it\'s about understanding your audience and timing. Let me share the strategies that actually work.',
            created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            likes_count: 89,
            comments_count: 12,
            is_trending: false,
            is_premium: true,
            profiles: {
              full_name: 'Tech Insider',
              subscription_tier: 'premium'
            }
          },
          {
            id: 'post_3',
            author_id: 'startup_user',
            title: 'Building My First SaaS: Lessons Learned',
            content: 'Six months ago, I launched my first SaaS product. Here\'s everything I wish I knew before starting, including the mistakes that cost me thousands and the wins that kept me going.',
            created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            likes_count: 156,
            comments_count: 34,
            is_trending: true,
            is_premium: false,
            profiles: {
              full_name: 'Alex Rodriguez',
              subscription_tier: 'free'
            }
          }
        ];
        localStorage.setItem('chhimeki_posts', JSON.stringify(demoPosts));
      }

      // Get initial session
      const { data: { session } } = await simulatedSupabase.auth.getSession();
      setSession(session);
      if (session?.user) {
        await loadUserProfile(session.user);
        await loadPosts();
      }
      setLoading(false);
    };

    initializeApp();

    // Listen for auth changes
    const { data: { subscription } } = simulatedSupabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) {
        await loadUserProfile(session.user);
        await loadPosts();
      } else {
        setCurrentUser(null);
        setPosts([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (user) => {
    try {
      const { data: profile, error } = await simulatedSupabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const { data: newProfile, error: createError } = await simulatedSupabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: user.user_metadata?.full_name || 'User',
            avatar_url: user.user_metadata?.avatar_url || null
          })
          .select()
          .single();

        if (createError) throw createError;
        setCurrentUser(newProfile);
      } else if (error) {
        throw error;
      } else {
        setCurrentUser(profile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Fallback to session user data
      setCurrentUser({
        id: user.id,
        full_name: user.user_metadata?.full_name || 'User',
        subscription_tier: 'free',
        followers_count: 156,
        following_count: 89
      });
    }
  };

  const loadPosts = async () => {
    try {
      const posts = JSON.parse(localStorage.getItem('chhimeki_posts') || '[]');
      
      const formattedPosts = posts.map(post => ({
        id: post.id,
        author: post.profiles.full_name,
        avatar: getAvatarInitials(post.profiles.full_name),
        title: post.title,
        content: post.content,
        timestamp: formatTimestamp(post.created_at),
        likes: post.likes_count,
        comments: post.comments_count,
        trending: post.is_trending,
        isPremium: post.is_premium || post.profiles.subscription_tier !== 'free'
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const getAvatarInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - postTime) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
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

    try {
      const { data, error } = await simulatedSupabase.auth.signUp({
        email: authForm.email,
        password: authForm.password,
        options: {
          data: {
            full_name: authForm.fullName
          }
        }
      });

      if (error) throw error;

      setAuthSuccess('Account created successfully! You can now sign in.');
      setAuthForm({ email: '', password: '', fullName: '', confirmPassword: '' });
      setTimeout(() => {
        setAuthMode('signin');
        setAuthSuccess('');
      }, 2000);
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const { data, error } = await simulatedSupabase.auth.signInWithPassword({
        email: authForm.email,
        password: authForm.password
      });

      if (error) throw error;

      setShowAuthModal(false);
      resetAuthForm();
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await simulatedSupabase.auth.signOut();
      if (error) throw error;
      
      // Trigger storage event for auth state change
      window.dispatchEvent(new StorageEvent('storage'));
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const resetAuthForm = () => {
    setAuthForm({ email: '', password: '', fullName: '', confirmPassword: '' });
    setAuthError('');
    setAuthSuccess('');
  };

  const handleCreatePost = async () => {
    if (!currentUser || !postTitle.trim()) return;

    setPostLoading(true);
    try {
      const { data, error } = await simulatedSupabase
        .from('posts')
        .insert({
          author_id: currentUser.id,
          title: postTitle,
          content: newPost || 'New thoughts to share with the community.'
        })
        .select()
        .single();

      if (error) throw error;

      const newPostData = {
        id: data.id,
        author: data.profiles.full_name,
        avatar: getAvatarInitials(data.profiles.full_name),
        title: data.title,
        content: data.content,
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        trending: false,
        isPremium: data.profiles.subscription_tier !== 'free'
      };

      setPosts([newPostData, ...posts]);
      setNewPost('');
      setPostTitle('');
    } catch (error) {
      console.error('Error creating post:', error);
      setAuthError('Failed to create post. Please try again.');
    } finally {
      setPostLoading(false);
    }
  };

  const handleLikePost = async (postId) => {
    if (!currentUser) return;

    // Optimistically update UI
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

    // In a real app, this would make an API call to Supabase
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update on error
      setPosts(posts.map(post => {
        if (post.id === postId) {
          const isLiked = post.isLiked;
          return {
            ...post,
            likes: isLiked ? post.likes + 1 : post.likes - 1,
            isLiked: !isLiked
          };
        }
        return post;
      }));
    }
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
            <h3 className="font-medium text-blue-900 mb-2">Demo Accounts</h3>
            <p className="text-sm text-blue-700 mb-2">Try the platform with:</p>
            <div className="text-sm font-mono text-blue-800 space-y-1">
              <div>📧 demo@chhimeki.com / 🔑 demo123</div>
              <div>📧 user@example.com / 🔑 password123</div>
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
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                )}

                {authError && (
                  <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="text-red-700 text-sm">{authError}</span>
                  </div>
                )}

                {authSuccess && (
                  <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-green-700 text-sm">{authSuccess}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
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
                  className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
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
              <button className="hidden md:flex items-center space-x-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:from-orange-600 hover:to-red-600 transition-all">
                <Crown className="w-4 h-4" />
                <span>Upgrade</span>
              </button>
              
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 relative transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {getAvatarInitials(currentUser?.full_name)}
                </div>
                <button onClick={handleSignOut} className="p-2 text-gray-600 hover:text-gray-900 transition-colors" title="Sign Out">
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
                        <Users className="w-5 h-5" />
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
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-white text-lg font-bold mx-auto mb-3">
                  {getAvatarInitials(currentUser?.full_name)}
                </div>
                <h3 className="font-bold text-gray-900">{currentUser?.full_name}</h3>
                <p className="text-sm text-gray-600 capitalize">{currentUser?.subscription_tier || 'Free'} Plan</p>
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

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Trending Topics</h3>
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
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">#SocialMedia</span>
                  <span className="text-sm text-gray-500">98K posts</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
              <div className="text-center">
                <Crown className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Upgrade to Premium</h3>
                <p className="text-sm text-gray-600 mb-4">Unlock advanced features and support creators</p>
                <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
