'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import SalonOwnerHeader from '@/components/salon-owner/SalonOwnerHeader';
import GlassCard, { GlassButton } from '@/components/ui/GlassCard';
import {
  Calendar,
  DollarSign,
  Star,
  Users,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  MessageSquare,
  Settings,
  ArrowRight,
  Plus,
  User
} from 'lucide-react';

export default function SalonOwnerDashboard() {
  const { user, userData } = useAuth();
  const [stats, setStats] = useState({
    todayBookings: 8,
    weeklyBookings: 42,
    monthlyRevenue: 15000,
    pendingBookings: 3,
    completedToday: 5,
    avgRating: 4.5,
    totalReviews: 156,
    responseRate: 85
  });

  const quickActions = [
    {
      title: 'View Bookings',
      description: 'Manage today\'s appointments',
      href: '/owner-appointments',
      icon: Calendar,
      color: 'from-blue-500 to-indigo-600',
      count: stats.todayBookings
    },
    {
      title: 'Check Reviews',
      description: 'Respond to customer feedback',
      href: '/reviews',
      icon: Star,
      color: 'from-yellow-500 to-orange-600',
      count: stats.totalReviews
    },
    {
      title: 'View Earnings',
      description: 'Track your revenue',
      href: '/earnings',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      amount: stats.monthlyRevenue
    },
    {
      title: 'Salon Profile',
      description: 'Update your information',
      href: '/salon-profile',
      icon: Settings,
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const recentBookings = [
    {
      id: 1,
      customerName: 'John Doe',
      service: 'Premium Haircut',
      time: '2:00 PM',
      status: 'confirmed',
      amount: 499
    },
    {
      id: 2,
      customerName: 'Sarah Wilson',
      service: 'Hair Coloring',
      time: '3:30 PM',
      status: 'pending',
      amount: 2499
    },
    {
      id: 3,
      customerName: 'Mike Brown',
      service: 'Beard Grooming',
      time: '4:00 PM',
      status: 'confirmed',
      amount: 299
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <SalonOwnerHeader />

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome back, {userData?.profile?.firstName}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your salon today
              </p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.todayBookings}</div>
                  <div className="text-sm text-gray-600">Today's Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">₹{stats.monthlyRevenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Monthly Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.avgRating}</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Verification Status */}
        {userData?.verificationStatus === 'pending' && (
          <GlassCard className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">Complete Your Profile</h3>
                <p className="text-gray-600 text-sm">
                  Your account is pending verification. Complete your profile to start receiving bookings.
                </p>
              </div>
              <Link href="/salon-profile">
                <GlassButton className="flex items-center space-x-2">
                  <span>Complete Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </GlassButton>
              </Link>
            </div>
          </GlassCard>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today's Bookings</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.todayBookings}</p>
                  <p className="text-sm text-blue-600 flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +2 from yesterday
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-gray-800">₹{stats.monthlyRevenue.toLocaleString()}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +12% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.avgRating}</p>
                  <p className="text-sm text-yellow-600 flex items-center mt-1">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    {stats.totalReviews} reviews
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Response Rate</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.responseRate}%</p>
                  <p className="text-sm text-purple-600 flex items-center mt-1">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Keep it up!
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href}>
                  <GlassCard className="p-6 hover:scale-105 transition-transform cursor-pointer group">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                        {action.count && (
                          <p className="text-lg font-bold text-gray-800 mt-1">{action.count}</p>
                        )}
                        {action.amount && (
                          <p className="text-lg font-bold text-gray-800 mt-1">₹{action.amount.toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Bookings */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Today's Bookings</h3>
              <Link href="/owner-appointments">
                <GlassButton variant="secondary" className="text-sm">
                  View All
                </GlassButton>
              </Link>
            </div>

            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-white/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{booking.customerName}</p>
                      <p className="text-sm text-gray-600">{booking.service}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{booking.time}</span>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </div>
                  </div>
                </div>
              ))}

              {recentBookings.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No bookings for today</p>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Business Insights */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Business Insights</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Completed Today</p>
                    <p className="text-sm text-gray-600">{stats.completedToday} owner-appointments</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">+{stats.completedToday}</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Pending Approval</p>
                    <p className="text-sm text-gray-600">{stats.pendingBookings} bookings</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-yellow-600">{stats.pendingBookings}</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">This Week</p>
                    <p className="text-sm text-gray-600">{stats.weeklyBookings} total bookings</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-600">{stats.weeklyBookings}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Performance this month</span>
                <span className="text-green-600 font-medium">+12% ↗</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
