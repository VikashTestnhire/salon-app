'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import {
  BuildingStorefrontIcon,
  UsersIcon,
  CalendarDaysIcon,
  CurrencyRupeeIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const { user, userData } = useAuth();
  const [stats, setStats] = useState({
    totalSalons: 0,
    pendingSalons: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch all collections in parallel
      const [salonsSnapshot, usersSnapshot, salonOwnersSnapshot, bookingsSnapshot] = await Promise.all([
        getDocs(collection(db, 'salons')),
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'salonOwners')),
        getDocs(collection(db, 'bookings'))
      ]);

      const salons = salonsSnapshot.docs.map(doc => doc.data());
      const users = usersSnapshot.docs.map(doc => doc.data());
      const salonOwners = salonOwnersSnapshot.docs.map(doc => doc.data());
      const bookings = bookingsSnapshot.docs.map(doc => doc.data());

      const pendingSalons = salons.filter(salon => salon.approvalStatus === 'pending').length;
      const completedBookings = bookings.filter(booking => booking.status === 'completed' && booking.payment?.status === 'paid');
      const totalRevenue = completedBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);

      setStats({
        totalSalons: salons.length,
        pendingSalons,
        totalUsers: users.length + salonOwners.length,
        totalBookings: bookings.length,
        totalRevenue
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const managementCards = [
    {
      title: 'Salon Management',
      description: 'Approve & manage salon registrations',
      href: '/admin/salons',
      icon: BuildingStorefrontIcon,
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      iconColor: 'text-blue-500',
      stat: `${stats.pendingSalons} pending approval`
    },
    {
      title: 'User Management',
      description: 'Monitor user accounts & activity',
      href: '/admin/users',
      icon: UsersIcon,
      color: 'bg-green-50 border-green-200 text-green-700',
      iconColor: 'text-green-500',
      stat: `${stats.totalUsers} total users`
    },
    {
      title: 'Bookings Overview',
      description: 'Track all platform bookings',
      href: '/admin/bookings',
      icon: CalendarDaysIcon,
      color: 'bg-purple-50 border-purple-200 text-purple-700',
      iconColor: 'text-purple-500',
      stat: `${stats.totalBookings} total bookings`
    },
    {
      title: 'Analytics & Revenue',
      description: 'Platform metrics & financial data',
      href: '/admin/analytics',
      icon: CurrencyRupeeIcon,
      color: 'bg-orange-50 border-orange-200 text-orange-700',
      iconColor: 'text-orange-500',
      stat: `₹${stats.totalRevenue.toLocaleString()} revenue`
    }
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {userData?.profile?.firstName}!
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Platform administration and oversight dashboard
        </p>
      </div>

      {/* Quick Stats */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white overflow-hidden shadow rounded-lg animate-pulse">
              <div className="p-5">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BuildingStorefrontIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Salons</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalSalons}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UsersIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalUsers}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CalendarDaysIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalBookings}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CurrencyRupeeIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                    <dd className="text-lg font-medium text-gray-900">₹{stats.totalRevenue.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pending Actions Alert */}
      {stats.pendingSalons > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <span className="font-medium">{stats.pendingSalons} salon{stats.pendingSalons !== 1 ? 's' : ''}</span> pending approval.
                <a href="/admin/salons" className="ml-1 font-medium underline hover:text-yellow-600">
                  Review them now →
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Management Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
        {managementCards.map((card) => (
          <a
            key={card.title}
            href={card.href}
            className={`${card.color} border-2 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 block`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <card.icon className={`h-8 w-8 ${card.iconColor}`} />
                <div className="ml-4">
                  <h3 className="text-lg font-medium">{card.title}</h3>
                  <p className="text-sm opacity-80">{card.description}</p>
                  <p className="text-xs mt-1 font-medium">{card.stat}</p>
                </div>
              </div>
              <ArrowRightIcon className="h-5 w-5 opacity-60" />
            </div>
          </a>
        ))}
      </div>

      {/* Admin Info */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Administrator Information
          </h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Role</dt>
              <dd className="mt-1">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                  ADMIN
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Admin Since</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Last Login</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date().toLocaleDateString()}
              </dd>
            </div>
          </dl>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Administrative Access
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    You have full administrative access to the platform. Use these tools responsibly
                    to maintain the quality and integrity of the salon booking platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
