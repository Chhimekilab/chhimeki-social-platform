// Mock Authentication Service for Demo Users
// This provides authentication functionality for the demo users without requiring Supabase

// Mock user database (same as in AuthContext)
const mockUsers = [
  {
    id: '1',
    email: 'demo@chhimeki.com',
    password: 'demo123',
    full_name: 'Demo User',
    username: 'demo_user',
    avatar: null,
    subscription_tier: 'premium',
    followers_count: 156,
    following_count: 89,
    bio: 'Tech enthusiast and social platform creator',
    location: 'San Francisco, CA',
    website: 'https://chhimeki.com',
    joined_date: '2024-01-15',
    verified: true
  },
  {
    id: '2',
    email: 'sarah@chhimeki.com',
    password: 'password123',
    full_name: 'Sarah Chen',
    username: 'sarah_chen',
    avatar: null,
    subscription_tier: 'premium',
    followers_count: 1250,
    following_count: 456,
    bio: 'Product Designer passionate about user experience',
    location: 'New York, NY',
    website: 'https://dribbble.com/sarah_chen',
    joined_date: '2024-02-20',
    verified: true
  },
  {
    id: '3',
    email: 'alex@chhimeki.com',
    password: 'beta2024',
    full_name: 'Alex Rodriguez',
    username: 'alex_rodriguez',
    avatar: null,
    subscription_tier: 'premium',
    followers_count: 892,
    following_count: 234,
    bio: 'Startup founder and tech entrepreneur',
    location: 'Austin, TX',
    website: 'https://alexrodriguez.com',
    joined_date: '2024-03-10',
    verified: true
  },
  {
    id: '4',
    email: 'maya@chhimeki.com',
    password: 'betauser',
    full_name: 'Maya Patel',
    username: 'maya_patel',
    avatar: null,
    subscription_tier: 'professional',
    followers_count: 567,
    following_count: 123,
    bio: 'UX/UI Designer at Google, design system enthusiast',
    location: 'Mountain View, CA',
    website: 'https://mayapatel.design',
    joined_date: '2024-03-15',
    verified: false
  },
  {
    id: '5',
    email: 'david@chhimeki.com',
    password: 'chhimeki2024',
    full_name: 'David Kim',
    username: 'david_kim',
    avatar: null,
    subscription_tier: 'professional',
    followers_count: 445,
    following_count: 678,
    bio: 'Software Engineer passionate about AI and ML',
    location: 'Seattle, WA',
    website: 'https://davidkim.dev',
    joined_date: '2024-04-01',
    verified: false
  },
  {
    id: '6',
    email: 'lisa@chhimeki.com',
    password: 'lisatest',
    full_name: 'Lisa Zhang',
    username: 'lisa_zhang',
    avatar: null,
    subscription_tier: 'free',
    followers_count: 234,
    following_count: 456,
    bio: 'Marketing professional and community builder',
    location: 'Los Angeles, CA',
    website: null,
    joined_date: '2024-04-10',
    verified: false
  },
  {
    id: '7',
    email: 'techie@chhimeki.com',
    password: 'techbeta',
    full_name: 'Tech Insider',
    username: 'tech_insider',
    avatar: null,
    subscription_tier: 'premium',
    followers_count: 2340,
    following_count: 89,
    bio: 'Tech journalist and industry analyst',
    location: 'San Jose, CA',
    website: 'https://techinsider.com',
    joined_date: '2024-02-01',
    verified: true
  },
  {
    id: '8',
    email: 'creator@chhimeki.com',
    password: 'create2024',
    full_name: 'Creative Studio',
    username: 'creative_studio',
    avatar: null,
    subscription_tier: 'premium',
    followers_count: 1890,
    following_count: 345,
    bio: 'Digital creative agency specializing in social media',
    location: 'Miami, FL',
    website: 'https://creativestudio.com',
    joined_date: '2024-01-20',
    verified: true
  },
  {
    id: '9',
    email: 'emma@chhimeki.com',
    password: 'emma2024',
    full_name: 'Emma Wilson',
    username: 'emma_wilson',
    avatar: null,
    subscription_tier: 'premium',
    followers_count: 3420,
    following_count: 567,
    bio: 'Content creator and lifestyle influencer',
    location: 'Los Angeles, CA',
    website: 'https://emmawilson.com',
    joined_date: '2024-01-05',
    verified: true
  },
  {
    id: '10',
    email: 'james@chhimeki.com',
    password: 'james123',
    full_name: 'James Thompson',
    username: 'james_thompson',
    avatar: null,
    subscription_tier: 'professional',
    followers_count: 789,
    following_count: 234,
    bio: 'Financial advisor helping people build wealth',
    location: 'Chicago, IL',
    website: 'https://jamesthompson.com',
    joined_date: '2024-02-15',
    verified: false
  },
  {
    id: '11',
    email: 'sophia@chhimeki.com',
    password: 'sophia456',
    full_name: 'Sophia Martinez',
    username: 'sophia_martinez',
    avatar: null,
    subscription_tier: 'free',
    followers_count: 156,
    following_count: 89,
    bio: 'Student and aspiring photographer',
    location: 'Boston, MA',
    website: null,
    joined_date: '2024-03-25',
    verified: false
  },
  {
    id: '12',
    email: 'mike@chhimeki.com',
    password: 'mike789',
    full_name: 'Mike Johnson',
    username: 'mike_johnson',
    avatar: null,
    subscription_tier: 'premium',
    followers_count: 5670,
    following_count: 123,
    bio: 'Fitness coach and wellness advocate',
    location: 'Denver, CO',
    website: 'https://mikejohnsonfitness.com',
    joined_date: '2024-01-10',
    verified: true
  },
  {
    id: '13',
    email: 'anna@chhimeki.com',
    password: 'anna2024',
    full_name: 'Anna Lee',
    username: 'anna_lee',
    avatar: null,
    subscription_tier: 'professional',
    followers_count: 890,
    following_count: 456,
    bio: 'Chef and food blogger sharing culinary adventures',
    location: 'Portland, OR',
    website: 'https://annaleechef.com',
    joined_date: '2024-02-28',
    verified: false
  },
  {
    id: '14',
    email: 'carlos@chhimeki.com',
    password: 'carlos123',
    full_name: 'Carlos Rodriguez',
    username: 'carlos_rodriguez',
    avatar: null,
    subscription_tier: 'free',
    followers_count: 234,
    following_count: 567,
    bio: 'Music producer and DJ',
    location: 'Nashville, TN',
    website: 'https://carlosrodriguezmusic.com',
    joined_date: '2024-04-05',
    verified: false
  },
  {
    id: '15',
    email: 'admin@chhimeki.com',
    password: 'admin2024',
    full_name: 'Chhimeki Admin',
    username: 'chhimeki_admin',
    avatar: null,
    subscription_tier: 'premium',
    followers_count: 12340,
    following_count: 89,
    bio: 'Official Chhimeki platform administrator',
    location: 'San Francisco, CA',
    website: 'https://chhimeki.com',
    joined_date: '2024-01-01',
    verified: true
  }
];

// Mock session storage
let currentSession = null;

// Mock Authentication Service
export const mockAuthService = {
  // Sign in user
  signIn: async (email, password) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return {
        data: null,
        error: { message: 'Invalid email or password' }
      };
    }
    
    // Create mock session
    const sessionUser = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      username: user.username,
      subscription_tier: user.subscription_tier,
      followers_count: user.followers_count,
      following_count: user.following_count,
      bio: user.bio,
      location: user.location,
      website: user.website,
      joined_date: user.joined_date,
      verified: user.verified,
      user_metadata: {
        full_name: user.full_name,
        username: user.username
      }
    };
    
    const session = {
      user: sessionUser,
      access_token: 'mock_access_token_' + user.id,
      refresh_token: 'mock_refresh_token_' + user.id
    };
    
    currentSession = session;
    
    // Store in localStorage for persistence
    localStorage.setItem('mock_auth_session', JSON.stringify(session));
    
    return {
      data: { user: session.user, session },
      error: null
    };
  },

  // Sign up user
  signUp: async (email, password, userData = {}) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return {
        data: null,
        error: { message: 'User already exists' }
      };
    }
    
    // Create new user
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      email,
      password,
      full_name: userData.full_name || 'New User',
      username: userData.username || 'new_user',
      avatar: null,
      subscription_tier: 'free',
      followers_count: 0,
      following_count: 0,
      bio: userData.bio || '',
      location: userData.location || '',
      website: userData.website || null,
      joined_date: new Date().toISOString().split('T')[0],
      verified: false
    };
    
    mockUsers.push(newUser);
    
    return {
      data: { user: newUser },
      error: null
    };
  },

  // Sign out user
  signOut: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    currentSession = null;
    localStorage.removeItem('mock_auth_session');
    
    return {
      error: null
    };
  },

  // Get current user
  getCurrentUser: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (!currentSession) {
      // Try to restore from localStorage
      const storedSession = localStorage.getItem('mock_auth_session');
      if (storedSession) {
        currentSession = JSON.parse(storedSession);
      }
    }
    
    return {
      user: currentSession?.user || null,
      error: null
    };
  },

  // Get session
  getSession: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (!currentSession) {
      // Try to restore from localStorage
      const storedSession = localStorage.getItem('mock_auth_session');
      if (storedSession) {
        currentSession = JSON.parse(storedSession);
      }
    }
    
    return currentSession;
  },

  // Reset password
  resetPassword: async (email) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return {
        error: { message: 'User not found' }
      };
    }
    
    return {
      error: null
    };
  },

  // Get user profile
  getProfile: async (userId) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      return {
        data: null,
        error: { message: 'User not found' }
      };
    }
    
    return {
      data: user,
      error: null
    };
  },

  // Update user profile
  updateProfile: async (userId, updates) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return {
        data: null,
        error: { message: 'User not found' }
      };
    }
    
    // Update user
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
    
    return {
      data: mockUsers[userIndex],
      error: null
    };
  }
};

export default mockAuthService; 