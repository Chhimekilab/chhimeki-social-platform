import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import { useAuth } from '../../contexts/AuthContext';

const AuthWrapper = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login', 'signup', 'forgot-password'

  console.log('🔍 AuthWrapper: isAuthenticated =', isAuthenticated, 'loading =', loading);

  if (loading) {
    console.log('🔍 AuthWrapper: Showing loading state');
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🔍 AuthWrapper: User not authenticated, showing login form');
    return (
      <>
        {authMode === 'login' && (
          <LoginForm
            onSwitchToSignup={() => setAuthMode('signup')}
            onSwitchToForgotPassword={() => setAuthMode('forgot-password')}
          />
        )}
        
        {authMode === 'signup' && (
          <SignupForm
            onSwitchToLogin={() => setAuthMode('login')}
          />
        )}
        
        {authMode === 'forgot-password' && (
          <ForgotPasswordForm
            onSwitchToLogin={() => setAuthMode('login')}
          />
        )}
      </>
    );
  }

  console.log('🔍 AuthWrapper: User authenticated, showing main app');
  return children;
};

export default AuthWrapper;