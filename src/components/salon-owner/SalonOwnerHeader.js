'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signOutUser } from '@/lib/firebase/auth';
import { 
  Store, 
  Calendar, 
  DollarSign, 
  Star,
  Settings,
  Bell, 
  User, 
  LogOut,
  Menu,
  X,
  TrendingUp,
  Users
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

const SalonOwnerHeader = () => {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOutUser();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigationItems = [
    { href: '/salon-dashboard', label: 'Dashboard', icon: Store },
    { href: '/owner-appointments', label: 'Bookings', icon: Calendar },
    { href: '/user-appointments', label: 'Bookingss', icon: Calendar },
    { href: '/earnings', label: 'Earnings', icon: DollarSign },
    { href: '/reviews', label: 'Reviews', icon: Star },
    { href: '/salon-profile', label: 'Profile', icon: Settings },
  ];

  return (
    <header className="relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700"></div>
      
      {/* Header content */}
      <GlassCard 
        className="relative mx-4 mt-4 p-4"
        gradient="from-white/10 to-white/5"
      >
        <div className="flex items-center justify-between">
          {/* Logo and brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">SalonBiz</h1>
              <p className="text-white/70 text-sm">Business Portal</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors group"
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User actions */}
          <div className="flex items-center space-x-4">
            {/* Quick Stats */}
            <div className="hidden lg:flex items-center space-x-4 text-white/80">
              <div className="text-center">
                <div className="text-lg font-bold">{userData?.monthlyEarnings?.toFixed(0) || '0'}</div>
                <div className="text-xs">This Month</div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">
                  {userData?.verificationStatus === 'verified' ? '✓' : '⏳'}
                </div>
                <div className="text-xs">Status</div>
              </div>
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-white/80 hover:text-white transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">2</span>
              </span>
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="font-medium text-sm">{userData?.profile?.firstName}</p>
                  <p className="text-xs text-white/60">
                    {userData?.businessInfo?.businessName || 'Business Owner'}
                  </p>
                </div>
              </button>

              {/* Profile dropdown menu */}
              {isProfileOpen && (
                <GlassCard 
                  className="absolute right-0 top-12 w-48 p-2 z-50"
                  gradient="from-white/90 to-white/80"
                >
                  <div className="space-y-1">
                    <Link
                      href="/salon-profile"
                      className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-white/50 rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Business Profile</span>
                    </Link>
                    <Link
                      href="/earnings"
                      className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-white/50 rounded-lg transition-colors"
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span>Earnings</span>
                    </Link>
                    <Link
                      href="/staff"
                      className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-white/50 rounded-lg transition-colors"
                    >
                      <Users className="w-4 h-4" />
                      <span>Staff Management</span>
                    </Link>
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50/50 rounded-lg transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </GlassCard>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white/80 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/20">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </GlassCard>

      {/* Click outside to close dropdowns */}
      {(isProfileOpen || isMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileOpen(false);
            setIsMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default SalonOwnerHeader;
