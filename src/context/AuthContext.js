'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChange, getUserData, USER_ROLES } from '@/lib/firebase/auth';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      try {
        setError(null);
        
        if (firebaseUser) {
          // User is signed in
          setUser(firebaseUser);
          
          // Get user data from Firestore
          const userDetails = await getUserData(firebaseUser.uid);
          setUserData(userDetails);
        } else {
          // User is signed out
          setUser(null);
          setUserData(null);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        setError(err.message);
        setUser(null);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Helper functions
  const isAuthenticated = () => {
    return !!user && !!userData;
  };

  const hasRole = (role) => {
    return userData && userData.role === role;
  };

  const isAdmin = () => {
    return hasRole(USER_ROLES.ADMIN);
  };

  const isSalonOwner = () => {
    return hasRole(USER_ROLES.SALON_OWNER);
  };

  const isUser = () => {
    return hasRole(USER_ROLES.USER);
  };

  const getRedirectPath = () => {
    if (!userData) return '/';
    
    switch (userData.role) {
      case USER_ROLES.ADMIN:
        return '/admin-dashboard';
      case USER_ROLES.SALON_OWNER:
        return '/salon-dashboard';
      case USER_ROLES.USER:
        return '/dashboard';
      default:
        return '/';
    }
  };

  const value = {
    user,
    userData,
    loading,
    error,
    isAuthenticated,
    hasRole,
    isAdmin,
    isSalonOwner,
    isUser,
    getRedirectPath,
    setUserData // For manual updates after profile changes
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
