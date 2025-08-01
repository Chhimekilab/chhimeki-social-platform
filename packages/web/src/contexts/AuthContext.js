import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { userService } from '../services/databaseService'

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
    }
  ])

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        await loadProfile(session.user.id)
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          await loadProfile(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (userId) => {
    try {
      const { data, error } = await userService.getProfile(userId)
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
      const { data, error } = await userService.signUp(email, password, userData)
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await userService.signIn(email, password)
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await userService.signOut()
      if (error) throw error
      setUser(null)
      setProfile(null)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const updateProfile = async (updates) => {
    if (!user) return { error: 'No user logged in' }
    
    try {
      const { data, error } = await userService.updateProfile(user.id, updates)
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
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
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