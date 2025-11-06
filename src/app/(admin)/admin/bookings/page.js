'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { 
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  BuildingStorefrontIcon,
  CurrencyRupeeIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

export default function BookingsManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed, cancelled
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const bookingsSnapshot = await getDocs(collection(db, 'bookings'));
      const bookingsData = bookingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: status,
        updatedAt: new Date().toISOString()
      });
      
      // Update local state
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: status }
          : booking
      ));
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const deleteBooking = async (bookingId) => {
    if (confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'bookings', bookingId));
        setBookings(prev => prev.filter(booking => booking.id !== bookingId));
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styles[paymentStatus]}`}>
        {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
      </span>
    );
  };

  const calculateTotalRevenue = () => {
    return bookings
      .filter(booking => booking.status === 'completed' && booking.payment?.status === 'paid')
      .reduce((total, booking) => total + (booking.totalAmount || 0), 0);
  };

  const getBookingStats = () => {
    const stats = {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };
    return stats;
  };

  const stats = getBookingStats();

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
          <h1 className="text-2xl font-semibold text-gray-900">Bookings Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Monitor and manage all bookings across the platform.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarDaysIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.completed}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.pending}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyRupeeIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="text-lg font-medium text-gray-900">₹{calculateTotalRevenue().toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mt-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'all', label: 'All Bookings', count: stats.total },
              { key: 'pending', label: 'Pending', count: stats.pending },
              { key: 'confirmed', label: 'Confirmed', count: stats.confirmed },
              { key: 'completed', label: 'Completed', count: stats.completed },
              { key: 'cancelled', label: 'Cancelled', count: stats.cancelled }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filter === tab.key
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Bookings list */}
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredBookings.map((booking) => (
            <li key={booking.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CalendarDaysIcon className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          Booking #{booking.id.slice(-8)}
                        </h3>
                        {getStatusBadge(booking.status)}
                        {booking.payment && getPaymentStatusBadge(booking.payment.status)}
                      </div>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 mr-1" />
                          {booking.customer?.name || 'Unknown Customer'}
                        </div>
                        <div className="flex items-center">
                          <BuildingStorefrontIcon className="h-4 w-4 mr-1" />
                          {booking.salon?.name || 'Unknown Salon'}
                        </div>
                        <div className="flex items-center">
                          <CurrencyRupeeIcon className="h-4 w-4 mr-1" />
                          ₹{booking.totalAmount || 0}
                        </div>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        Services: {booking.services?.map(s => s.name).join(', ') || 'No services listed'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowModal(true);
                      }}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View
                    </button>
                    
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Confirm
                      </button>
                    )}
                    
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                      >
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex space-x-4">
                    <p className="flex items-center text-sm text-gray-500">
                      <CalendarDaysIcon className="h-4 w-4 mr-1" />
                      {booking.date ? new Date(booking.date).toLocaleDateString() : 'No date set'}
                    </p>
                    <p className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {booking.timeSlot || 'No time set'}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Created: {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' ? 'No bookings have been made yet.' : `No ${filter} bookings found.`}
            </p>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Booking Details: #{selectedBooking.id.slice(-8)}
                      </h3>
                      <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Booking Information</h4>
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                            <dd className="text-sm text-gray-900">{getStatusBadge(selectedBooking.status)}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Date</dt>
                            <dd className="text-sm text-gray-900">
                              {selectedBooking.date ? new Date(selectedBooking.date).toLocaleDateString() : 'Not set'}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Time</dt>
                            <dd className="text-sm text-gray-900">{selectedBooking.timeSlot || 'Not set'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                            <dd className="text-sm text-gray-900">₹{selectedBooking.totalAmount || 0}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
                            <dd className="text-sm text-gray-900">
                              {selectedBooking.payment ? getPaymentStatusBadge(selectedBooking.payment.status) : 'No payment info'}
                            </dd>
                          </div>
                        </dl>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Customer & Salon</h4>
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Customer</dt>
                            <dd className="text-sm text-gray-900">{selectedBooking.customer?.name || 'Unknown'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Customer Email</dt>
                            <dd className="text-sm text-gray-900">{selectedBooking.customer?.email || 'Not provided'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Customer Phone</dt>
                            <dd className="text-sm text-gray-900">{selectedBooking.customer?.phone || 'Not provided'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Salon</dt>
                            <dd className="text-sm text-gray-900">{selectedBooking.salon?.name || 'Unknown'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Salon Address</dt>
                            <dd className="text-sm text-gray-900">{selectedBooking.salon?.address || 'Not provided'}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                    
                    {selectedBooking.services && selectedBooking.services.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium text-gray-900 mb-2">Services ({selectedBooking.services.length})</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {selectedBooking.services.map((service, index) => (
                            <div key={index} className="border rounded-lg p-3">
                              <h5 className="font-medium text-gray-900">{service.name}</h5>
                              <div className="mt-1 flex justify-between">
                                <span className="text-sm font-medium text-green-600">₹{service.price}</span>
                                <span className="text-sm text-gray-500">{service.duration} mins</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedBooking.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        updateBookingStatus(selectedBooking.id, 'confirmed');
                        setShowModal(false);
                      }}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Confirm Booking
                    </button>
                    <button
                      onClick={() => {
                        updateBookingStatus(selectedBooking.id, 'cancelled');
                        setShowModal(false);
                      }}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel Booking
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
