import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AuthDebugger = () => {
  const { user, profile, loading, isAuthenticated, demoUsers, clearSession } = useAuth();

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <h3 className="font-semibold text-sm text-gray-700 mb-2">🔍 Auth Debugger</h3>
      
      <div className="space-y-2 text-xs">
        <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
        <div><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</div>
        <div><strong>User:</strong> {user ? user.email : 'None'}</div>
        <div><strong>Profile:</strong> {profile ? profile.full_name : 'None'}</div>
        <div><strong>LocalStorage:</strong> {localStorage.getItem('mock_auth_session') ? 'Has Session' : 'No Session'}</div>
      </div>

      <div className="mt-3 space-y-2">
        <button
          onClick={clearSession}
          className="w-full bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
        >
          Clear Session
        </button>
        
        <details className="text-xs">
          <summary className="cursor-pointer text-blue-600">Demo Users</summary>
          <div className="mt-2 space-y-1">
            {demoUsers.map((demoUser, index) => (
              <div key={index} className="text-xs">
                <strong>{demoUser.name}:</strong> {demoUser.email} / {demoUser.password}
              </div>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
};

export default AuthDebugger;
