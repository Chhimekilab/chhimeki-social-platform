import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, db } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user) {
          await loadUserProfile(session.user);
        }
      } catch (err) {
        console.error('Error getting session:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (authUser) => {
    try {
      const { data: profile, error } = await db.users
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // User profile doesn't exist, create one
        const newProfile = {
          id: authUser.id,
          email: authUser.email,
          username: authUser.user_metadata?.username || `user_${authUser.id.slice(0, 8)}`,
          full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'New User',
          bio: '',
          avatar_url: authUser.user_metadata?.avatar_url || null,
          website: '',
          location: '',
          subscription_tier: 'free',
          verified: false,
          private_account: false
        };

        const { data: createdProfile, error: createError } = await db.users
          .insert(newProfile)
          .select()
          .single();

        if (createError) throw createError;
        setUser(createdProfile);
      } else if (error) {
        throw error;
      } else {
        setUser(profile);
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
      setError(err.message);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      return { success: true, user: data.user };
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            username: userData.username,
            full_name: userData.full_name
          }
        }
      });

      if (error) throw error;

      if (data.user && !data.user.email_confirmed_at) {
        return { 
          success: true, 
          user: data.user,
          message: 'Please check your email to confirm your account'
        };
      }

      return { success: true, user: data.user };
    } catch (err) {
      const errorMessage = err.message || 'Signup failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err) {
      console.error('Error logging out:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    setLoading(true);
    setError(null);

    try {
      if (!user) throw new Error('No user logged in');

      // Update user profile in database
      const { data: updatedProfile, error } = await db.users
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setUser(updatedProfile);
      return { success: true, user: updatedProfile };
    } catch (err) {
      const errorMessage = err.message || 'Profile update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      return { 
        success: true, 
        message: 'Password reset email sent. Please check your inbox.' 
      };
    } catch (err) {
      const errorMessage = err.message || 'Password reset failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      return { success: true, message: 'Password updated successfully' };
    } catch (err) {
      const errorMessage = err.message || 'Password update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    resetPassword,
    updatePassword,
    isAuthenticated: !!user,
    supabaseUser: user // Expose the full user object
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};