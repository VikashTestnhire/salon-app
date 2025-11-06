'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import "./globals.css";

console.log("✅ Firebase ENV Variables Loaded:");
console.log("API KEY:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log("AUTH DOMAIN:", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
console.log("PROJECT ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

export default function Home() {
  const { isAuthenticated, getRedirectPath, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated()) {
        // Redirect to role-based dashboard
        const redirectPath = getRedirectPath();
        router.push(redirectPath);
      } else {
        // Redirect to login
        router.push('/login');
      }
    }
  }, [isAuthenticated, loading, router, getRedirectPath]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
        
      </div>
    );
  }

  return null;
}
