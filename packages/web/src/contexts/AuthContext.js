import React, { createContext, useContext, useEffect, useState } from 'react'
import { mockAuthService } from '../services/mockAuthService'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Beta demo users database
  const [users, setUsers] = useState([
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
  ])

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🔍 AuthContext: Initializing session...');
        
        // First try to get from mockAuthService
        const session = await mockAuthService.getSession();
        console.log('🔍 AuthContext: Session result:', session);
        
        if (session && session.user) {
          console.log('🔍 AuthContext: User found, setting user state');
          setUser(session.user);
          await loadProfile(session.user.id);
        } else {
          console.log('🔍 AuthContext: No session found, checking localStorage directly');
          
          // Fallback: check localStorage directly
          const storedSession = localStorage.getItem('mock_auth_session');
          if (storedSession) {
            try {
              const parsedSession = JSON.parse(storedSession);
              if (parsedSession && parsedSession.user) {
                console.log('🔍 AuthContext: Found session in localStorage, restoring user');
                setUser(parsedSession.user);
                await loadProfile(parsedSession.user.id);
              }
            } catch (parseError) {
              console.error('🔍 AuthContext: Error parsing stored session:', parseError);
              localStorage.removeItem('mock_auth_session'); // Clean up corrupted data
            }
          } else {
            console.log('🔍 AuthContext: No stored session found, user will need to login');
          }
        }
      } catch (error) {
        console.error('🔍 AuthContext: Error getting initial session:', error);
      } finally {
        console.log('🔍 AuthContext: Setting loading to false');
        setLoading(false);
      }
    }

    getInitialSession()
  }, [])

  const loadProfile = async (userId) => {
    try {
      const { data, error } = await mockAuthService.getProfile(userId)
      if (error) {
        console.error('Error loading profile:', error)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const signUp = async (email, password, userData = {}) => {
    try {
      const { data, error } = await mockAuthService.signUp(email, password, userData)
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await mockAuthService.signIn(email, password)
      if (error) throw error
      
      // Set user and load profile on successful login
      if (data?.user) {
        setUser(data.user)
        await loadProfile(data.user.id)
      }
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      console.log('🔄 Signing out user...')
      
      // Call mockAuthService signOut
      const { error } = await mockAuthService.signOut()
      if (error) throw error
      
      // Clear all local state
      setUser(null)
      setProfile(null)
      setError(null)
      
      // Ensure localStorage is cleared
      localStorage.removeItem('mock_auth_session')
      
      console.log('✅ User signed out successfully')
      return { error: null }
    } catch (error) {
      console.error('❌ Error signing out:', error)
      
      // Even if there's an error, clear local state
      setUser(null)
      setProfile(null)
      setError(null)
      localStorage.removeItem('mock_auth_session')
      
      return { error }
    }
  }

  const updateProfile = async (updates) => {
    if (!user) return { error: 'No user logged in' }
    
    try {
      const { data, error } = await mockAuthService.updateProfile(user.id, updates)
      if (error) throw error
      
      // Update local profile state
      setProfile(prev => ({ ...prev, ...updates }))
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const resetPassword = async (email) => {
    try {
      const { error } = await mockAuthService.resetPassword(email)
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const clearSession = () => {
    console.log('🧹 Manually clearing session...')
    setUser(null)
    setProfile(null)
    setError(null)
    localStorage.removeItem('mock_auth_session')
    console.log('✅ Session cleared manually')
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    resetPassword,
    clearSession,
    isAuthenticated: !!user,
    // Beta helper - expose demo users for testing
    demoUsers: users.map(u => ({ email: u.email, password: u.password, name: u.full_name }))
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 