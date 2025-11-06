'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { 
  CurrencyRupeeIcon,
  UsersIcon,
  BuildingStorefrontIcon,
  CalendarDaysIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    revenue: {
      total: 0,
      thisMonth: 0,
      lastMonth: 0,
      commission: 0
    },
    users: {
      total: 0,
      active: 0,
      newThisMonth: 0
    },
    salons: {
      total: 0,
      approved: 0,
      pending: 0,
      topPerforming: []
    },
    bookings: {
      total: 0,
      thisMonth: 0,
      completed: 0,
      cancelled: 0
    }
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch all data in parallel
      const [
        bookingsSnapshot,
        usersSnapshot,
        salonOwnersSnapshot,
        salonsSnapshot
      ] = await Promise.all([
        getDocs(collection(db, 'bookings')),
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'salonOwners')),
        getDocs(collection(db, 'salons'))
      ]);

      const bookings = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const salonOwners = salonOwnersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const salons = salonsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Calculate analytics
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

      // Revenue calculations
      const completedBookings = bookings.filter(b => b.status === 'completed' && b.payment?.status === 'paid');
      const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      const commissionRate = 0.15; // 15% commission
      const totalCommission = totalRevenue * commissionRate;

      const thisMonthBookings = completedBookings.filter(b => {
        const bookingDate = new Date(b.createdAt);
        return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
      });
      const thisMonthRevenue = thisMonthBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      const lastMonthBookings = completedBookings.filter(b => {
        const bookingDate = new Date(b.createdAt);
        return bookingDate.getMonth() === lastMonth && bookingDate.getFullYear() === lastMonthYear;
      });
      const lastMonthRevenue = lastMonthBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      // User calculations
      const allUsers = [...users, ...salonOwners];
      const activeUsers = allUsers.filter(u => u.isActive);
      const newUsersThisMonth = allUsers.filter(u => {
        const userDate = new Date(u.createdAt);
        return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear;
      });

      // Salon calculations
      const approvedSalons = salons.filter(s => s.approvalStatus === 'approved');
      const pendingSalons = salons.filter(s => s.approvalStatus === 'pending');

      // Top performing salons (by booking count)
      const salonBookingCounts = {};
      bookings.forEach(booking => {
        const salonId = booking.salonId;
        if (salonId) {
          salonBookingCounts[salonId] = (salonBookingCounts[salonId] || 0) + 1;
        }
      });

      const topSalons = Object.entries(salonBookingCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([salonId, bookingCount]) => {
          const salon = salons.find(s => s.id === salonId);
          return {
            id: salonId,
            name: salon?.name || 'Unknown Salon',
            bookingCount,
            revenue: bookings
              .filter(b => b.salonId === salonId && b.status === 'completed')
              .reduce((sum, b) => sum + (b.totalAmount || 0), 0)
          };
        });

      // Booking calculations
      const completedBookingsCount = bookings.filter(b => b.status === 'completed').length;
      const cancelledBookingsCount = bookings.filter(b => b.status === 'cancelled').length;

      setAnalytics({
        revenue: {
          total: totalRevenue,
          thisMonth: thisMonthRevenue,
          lastMonth: lastMonthRevenue,
          commission: totalCommission
        },
        users: {
          total: allUsers.length,
          active: activeUsers.length,
          newThisMonth: newUsersThisMonth.length
        },
        salons: {
          total: salons.length,
          approved: approvedSalons.length,
          pending: pendingSalons.length,
          topPerforming: topSalons
        },
        bookings: {
          total: bookings.length,
          thisMonth: thisMonthBookings.length,
          completed: completedBookingsCount,
          cancelled: cancelledBookingsCount
        }
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateGrowth = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const revenueGrowth = calculateGrowth(analytics.revenue.thisMonth, analytics.revenue.lastMonth);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Platform performance metrics and revenue analytics.
          </p>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="mt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Revenue Overview</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CurrencyRupeeIcon className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                    <dd className="text-lg font-medium text-gray-900">₹{analytics.revenue.total.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CurrencyRupeeIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">This Month</dt>
                    <dd className="text-lg font-medium text-gray-900">₹{analytics.revenue.thisMonth.toLocaleString()}</dd>
                    <dd className="flex items-center text-sm">
                      {revenueGrowth >= 0 ? (
                        <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {Math.abs(revenueGrowth).toFixed(1)}%
                      </span>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CurrencyRupeeIcon className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Commission</dt>
                    <dd className="text-lg font-medium text-gray-900">₹{analytics.revenue.commission.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CalendarDaysIcon className="h-6 w-6 text-indigo-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Bookings This Month</dt>
                    <dd className="text-lg font-medium text-gray-900">{analytics.bookings.thisMonth}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Overview */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Platform Overview</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UsersIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                    <dd className="text-lg font-medium text-gray-900">{analytics.users.total}</dd>
                    <dd className="text-sm text-gray-600">{analytics.users.active} active</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BuildingStorefrontIcon className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Salons</dt>
                    <dd className="text-lg font-medium text-gray-900">{analytics.salons.total}</dd>
                    <dd className="text-sm text-gray-600">{analytics.salons.approved} approved</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CalendarDaysIcon className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
                    <dd className="text-lg font-medium text-gray-900">{analytics.bookings.total}</dd>
                    <dd className="text-sm text-gray-600">{analytics.bookings.completed} completed</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UsersIcon className="h-6 w-6 text-orange-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">New Users</dt>
                    <dd className="text-lg font-medium text-gray-900">{analytics.users.newThisMonth}</dd>
                    <dd className="text-sm text-gray-600">This month</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Salons */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Top Performing Salons</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {analytics.salons.topPerforming.map((salon, index) => (
              <li key={salon.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{salon.name}</h3>
                        <p className="text-sm text-gray-500">{salon.bookingCount} bookings</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-medium text-gray-900">₹{salon.revenue.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Revenue</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          {analytics.salons.topPerforming.length === 0 && (
            <div className="text-center py-12">
              <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
              <p className="mt-1 text-sm text-gray-500">
                Top performing salons will appear here once there are completed bookings.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Detailed Statistics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Stats */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Bookings</span>
                <span className="text-sm font-medium text-gray-900">{analytics.bookings.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="text-sm font-medium text-green-600">{analytics.bookings.completed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Cancelled</span>
                <span className="text-sm font-medium text-red-600">{analytics.bookings.cancelled}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="text-sm font-medium text-gray-900">
                  {analytics.bookings.total > 0 
                    ? ((analytics.bookings.completed / analytics.bookings.total) * 100).toFixed(1) 
                    : 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Salon Stats */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Salon Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Salons</span>
                <span className="text-sm font-medium text-gray-900">{analytics.salons.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Approved</span>
                <span className="text-sm font-medium text-green-600">{analytics.salons.approved}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Pending Approval</span>
                <span className="text-sm font-medium text-yellow-600">{analytics.salons.pending}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Approval Rate</span>
                <span className="text-sm font-medium text-gray-900">
                  {analytics.salons.total > 0 
                    ? ((analytics.salons.approved / analytics.salons.total) * 100).toFixed(1) 
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
