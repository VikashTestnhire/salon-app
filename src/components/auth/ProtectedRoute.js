'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { USER_ROLES } from '@/lib/firebase/auth';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  allowedRoles = [], 
  redirectTo = '/login',
  requireAuth = true 
}) => {
  const { user, userData, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait for auth state to be determined

    // If authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated()) {
      router.push(redirectTo);
      return;
    }

    // If user is authenticated, check role-based access
    if (isAuthenticated()) {
      const userRole = userData?.role;

      // Check if user has required role
      if (requiredRole && userRole !== requiredRole) {
        // Redirect to appropriate dashboard based on user's actual role
        router.push(getRedirectPath(userRole));
        return;
      }

      // Check if user's role is in allowed roles
      if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        // Redirect to appropriate dashboard based on user's actual role
        router.push(getRedirectPath(userRole));
        return;
      }
    }
  }, [user, userData, loading, router, requiredRole, allowedRoles, requireAuth, isAuthenticated, redirectTo]);

  // Helper function to get redirect path based on role
  const getRedirectPath = (role) => {
    switch (role) {
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

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated, don't render
  if (requireAuth && !isAuthenticated()) {
    return null;
  }

  // If role is required but user doesn't have it, don't render
  if (isAuthenticated()) {
    const userRole = userData?.role;
    
    if (requiredRole && userRole !== requiredRole) {
      return null;
    }
    
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      return null;
    }
  }

  return children;
};

export default ProtectedRoute;

// HOC for easier usage
export const withAuth = (Component, options = {}) => {
  return function AuthenticatedComponent(props) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

// Specific role-based route components
export const AdminRoute = ({ children, redirectTo = '/login' }) => (
  <ProtectedRoute requiredRole={USER_ROLES.ADMIN} redirectTo={redirectTo}>
    {children}
  </ProtectedRoute>
);

export const SalonOwnerRoute = ({ children, redirectTo = '/login' }) => (
  <ProtectedRoute requiredRole={USER_ROLES.SALON_OWNER} redirectTo={redirectTo}>
    {children}
  </ProtectedRoute>
);

export const UserRoute = ({ children, redirectTo = '/login' }) => (
  <ProtectedRoute requiredRole={USER_ROLES.USER} redirectTo={redirectTo}>
    {children}
  </ProtectedRoute>
);

export const AuthenticatedRoute = ({ children, redirectTo = '/login' }) => (
  <ProtectedRoute requireAuth={true} redirectTo={redirectTo}>
    {children}
  </ProtectedRoute>
);

export const GuestRoute = ({ children, redirectTo = null }) => {
  const { isAuthenticated, getRedirectPath } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      const path = redirectTo || getRedirectPath();
      router.push(path);
    }
  }, [isAuthenticated, router, redirectTo, getRedirectPath]);

  if (isAuthenticated()) {
    return null;
  }

  return children;
};
