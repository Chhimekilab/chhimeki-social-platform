import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Mock user database
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
      email: 'sarah@example.com',
      password: 'password123',
      full_name: 'Sarah Chen',
      username: 'sarah_chen',
      avatar: null,
      subscription_tier: 'premium',
      followers_count: 1250,
      following_count: 456,
      bio: 'Product Designer passionate about user experience',
      location: 'New York, NY',
      website: null,
      joined_date: '2024-02-20',
      verified: true
    }
  ]);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('chhimeki_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (err) {
        console.error('Error parsing saved user data:', err);
        localStorage.removeItem('chhimeki_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = foundUser;
      
      setUser(userWithoutPassword);
      localStorage.setItem('chhimeki_user', JSON.stringify(userWithoutPassword));
      
      return { success: true, user: userWithoutPassword };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      const existingUser = users.find(u => u.email === userData.email || u.username === userData.username);
      if (existingUser) {
        throw new Error('User with this email or username already exists');
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email: userData.email,
        password: userData.password,
        full_name: userData.full_name,
        username: userData.username,
        avatar: null,
        subscription_tier: 'free',
        followers_count: 0,
        following_count: 0,
        bio: '',
        location: '',
        website: '',
        joined_date: new Date().toISOString().split('T')[0],
        verified: false
      };

      setUsers(prev => [...prev, newUser]);
      
      // Auto-login after signup
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('chhimeki_user', JSON.stringify(userWithoutPassword));
      
      return { success: true, user: userWithoutPassword };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chhimeki_user');
  };

  const updateProfile = async (updates) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('chhimeki_user', JSON.stringify(updatedUser));

      // Update in mock database
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, ...updates } : u));

      return { success: true, user: updatedUser };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const foundUser = users.find(u => u.email === email);
      if (!foundUser) {
        throw new Error('No account found with this email address');
      }

      // In a real app, this would send an email
      console.log('Password reset email sent to:', email);
      
      return { success: true, message: 'Password reset email sent' };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
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
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};