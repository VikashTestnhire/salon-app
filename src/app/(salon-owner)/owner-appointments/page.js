'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import SalonOwnerHeader from '@/components/salon-owner/SalonOwnerHeader';
import GlassCard, { GlassButton } from '@/components/ui/GlassCard';
import { 
  Calendar,
  Clock,
  User,
  Phone,
  Check,
  X,
  MoreVertical,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';

// Mock data for bookings
const mockBookings = [
  {
    id: 'booking_001',
    customerName: 'John Doe',
    customerPhone: '+91-9876543210',
    customerEmail: 'john@example.com',
    serviceName: 'Premium Haircut & Styling',
    staffName: 'Priya Sharma',
    staffId: 'staff_1',
    date: '2024-01-25',
    time: '14:00',
    endTime: '14:45',
    duration: 45,
    amount: 499,
    status: 'pending',
    bookingDate: '2024-01-20T10:30:00Z',
    paymentStatus: 'paid',
    specialRequests: 'Please use organic products'
  },
  {
    id: 'booking_002',
    customerName: 'Sarah Wilson',
    customerPhone: '+91-9876543211',
    customerEmail: 'sarah@example.com',
    serviceName: 'Hair Coloring',
    staffName: 'Raj Patel',
    staffId: 'staff_2',
    date: '2024-01-25',
    time: '10:00',
    endTime: '11:30',
    duration: 90,
    amount: 2499,
    status: 'confirmed',
    bookingDate: '2024-01-22T15:20:00Z',
    paymentStatus: 'paid',
    specialRequests: ''
  },
  {
    id: 'booking_003',
    customerName: 'Mike Brown',
    customerPhone: '+91-9876543212',
    customerEmail: 'mike@example.com',
    serviceName: 'Beard Grooming',
    staffName: 'Priya Sharma',
    staffId: 'staff_1',
    date: '2024-01-24',
    time: '16:00',
    endTime: '16:30',
    duration: 30,
    amount: 299,
    status: 'completed',
    bookingDate: '2024-01-23T09:15:00Z',
    paymentStatus: 'paid',
    specialRequests: ''
  },
  {
    id: 'booking_004',
    customerName: 'Lisa Chen',
    customerPhone: '+91-9876543213',
    customerEmail: 'lisa@example.com',
    serviceName: 'Facial Treatment',
    staffName: 'Raj Patel',
    staffId: 'staff_2',
    date: '2024-01-26',
    time: '11:00',
    endTime: '12:00',
    duration: 60,
    amount: 899,
    status: 'cancelled',
    bookingDate: '2024-01-21T14:45:00Z',
    paymentStatus: 'refunded',
    specialRequests: ''
  }
];

const ManageBookingsPage = () => {
  const { userData } = useAuth();
  const [bookings, setBookings] = useState(mockBookings);
  const [filteredBookings, setFilteredBookings] = useState(mockBookings);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All', count: bookings.length },
    { value: 'pending', label: 'Pending', count: bookings.filter(b => b.status === 'pending').length },
    { value: 'confirmed', label: 'Confirmed', count: bookings.filter(b => b.status === 'confirmed').length },
    { value: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
    { value: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length }
  ];

  useEffect(() => {
    filterBookings();
  }, [statusFilter, searchTerm, selectedDate, viewMode, bookings]);

  const filterBookings = () => {
    let filtered = [...bookings];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerPhone.includes(searchTerm)
      );
    }

    // Filter by date for calendar view
    if (viewMode === 'calendar') {
      const dateStr = selectedDate.toISOString().split('T')[0];
      filtered = filtered.filter(booking => booking.date === dateStr);
    }

    // Sort by date and time
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA - dateB;
    });

    setFilteredBookings(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        )
      );
      
      // Show success message
      alert(`Booking ${newStatus} successfully!`);
    } catch (error) {
      alert('Failed to update booking status');
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const getBookingsForTimeSlot = (time) => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return filteredBookings.filter(booking => 
      booking.date === dateStr && booking.time === time
    );
  };

  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter(b => b.date === today);
    
    return {
      total: todayBookings.length,
      pending: todayBookings.filter(b => b.status === 'pending').length,
      confirmed: todayBookings.filter(b => b.status === 'confirmed').length,
      completed: todayBookings.filter(b => b.status === 'completed').length,
      revenue: todayBookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.amount, 0)
    };
  };

  const todayStats = getTodayStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <SalonOwnerHeader />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manage Bookings</h1>
            <p className="text-gray-600 mt-1">View and manage customer appointments</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <GlassButton
              variant={viewMode === 'list' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('list')}
              className="text-sm"
            >
              List View
            </GlassButton>
            <GlassButton
              variant={viewMode === 'calendar' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('calendar')}
              className="text-sm"
            >
              Calendar View
            </GlassButton>
          </div>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-800">{todayStats.total}</div>
            <div className="text-sm text-gray-600">Total Today</div>
          </GlassCard>
          
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{todayStats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </GlassCard>
          
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{todayStats.confirmed}</div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </GlassCard>
          
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{todayStats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </GlassCard>
          
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">₹{todayStats.revenue}</div>
            <div className="text-sm text-gray-600">Revenue</div>
          </GlassCard>
        </div>

        {/* Filters */}
        <GlassCard className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/20 backdrop-blur-lg border border-white/20 rounded-lg pl-10 pr-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
              />
            </div>

            {/* Status Filter */}
            <div className="flex space-x-2 overflow-x-auto">
              {statusOptions.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setStatusFilter(status.value)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                    ${statusFilter === status.value
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/20 text-gray-700 hover:bg-white/30'
                    }
                  `}
                >
                  {status.label} ({status.count})
                </button>
              ))}
            </div>

            {/* Date Picker for Calendar View */}
            {viewMode === 'calendar' && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000))}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="text-center min-w-[120px]">
                  <div className="font-medium text-gray-800">
                    {selectedDate.toLocaleDateString('en', { weekday: 'short' })}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedDate.toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Bookings Content */}
        {viewMode === 'list' ? (
          /* List View */
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <GlassCard key={booking.id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  {/* Booking Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{booking.customerName}</h3>
                          <p className="text-sm text-gray-600">{booking.customerPhone}</p>
                        </div>
                      </div>
                      
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="capitalize">{booking.status}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {new Date(booking.date).toLocaleDateString('en', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {booking.time} - {booking.endTime}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">₹{booking.amount}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="font-medium text-gray-800">{booking.serviceName}</p>
                      <p className="text-sm text-gray-600">with {booking.staffName}</p>
                      {booking.specialRequests && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Special Request:</span> {booking.specialRequests}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 lg:ml-6">
                    {booking.status === 'pending' && (
                      <>
                        <GlassButton
                          onClick={() => handleStatusChange(booking.id, 'confirmed')}
                          disabled={loading}
                          className="text-sm py-2 px-4"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Accept
                        </GlassButton>
                        <GlassButton
                          variant="danger"
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                          disabled={loading}
                          className="text-sm py-2 px-4"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Decline
                        </GlassButton>
                      </>
                    )}

                    {booking.status === 'confirmed' && (
                      <GlassButton
                        variant="success"
                        onClick={() => handleStatusChange(booking.id, 'completed')}
                        disabled={loading}
                        className="text-sm py-2 px-4"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Mark Complete
                      </GlassButton>
                    )}

                    <a href={`tel:${booking.customerPhone}`}>
                      <GlassButton variant="secondary" className="w-full text-sm py-2">
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </GlassButton>
                    </a>

                    <GlassButton
                      variant="secondary"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowDetailsModal(true);
                      }}
                      className="text-sm py-2 px-4"
                    >
                      <MoreVertical className="w-4 h-4 mr-2" />
                      Details
                    </GlassButton>
                  </div>
                </div>
              </GlassCard>
            ))}

            {filteredBookings.length === 0 && (
              <GlassCard className="p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No bookings found</h3>
                <p className="text-gray-600">
                  {statusFilter === 'all' 
                    ? 'No bookings match your search criteria' 
                    : `No ${statusFilter} bookings found`
                  }
                </p>
              </GlassCard>
            )}
          </div>
        ) : (
          /* Calendar View */
          <GlassCard className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Schedule for {selectedDate.toLocaleDateString('en', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>

              <div className="space-y-2">
                {generateTimeSlots().map((time) => {
                  const timeBookings = getBookingsForTimeSlot(time);
                  
                  return (
                    <div key={time} className="flex items-center space-x-4 p-3 bg-white/20 rounded-lg">
                      <div className="w-16 text-sm font-medium text-gray-700">
                        {time}
                      </div>
                      
                      <div className="flex-1">
                        {timeBookings.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {timeBookings.map((booking) => (
                              <div
                                key={booking.id}
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowDetailsModal(true);
                                }}
                                className={`
                                  px-3 py-2 rounded-lg text-sm cursor-pointer transition-all hover:scale-105
                                  ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                    booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                  }
                                `}
                              >
                                <div className="font-medium">{booking.customerName}</div>
                                <div className="text-xs">{booking.serviceName}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm italic">Available</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        )}

        {/* Booking Details Modal */}
        {showDetailsModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <GlassCard className="max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Booking Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800">Customer Information</h4>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Name:</span> {selectedBooking.customerName}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Phone:</span> {selectedBooking.customerPhone}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Email:</span> {selectedBooking.customerEmail}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800">Appointment Details</h4>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Service:</span> {selectedBooking.serviceName}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Staff:</span> {selectedBooking.staffName}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Date:</span> {new Date(selectedBooking.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Time:</span> {selectedBooking.time} - {selectedBooking.endTime}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Duration:</span> {selectedBooking.duration} minutes
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Amount:</span> ₹{selectedBooking.amount}
                    </p>
                  </div>
                </div>

                {selectedBooking.specialRequests && (
                  <div>
                    <h4 className="font-semibold text-gray-800">Special Requests</h4>
                    <p className="text-sm text-gray-600 mt-1">{selectedBooking.specialRequests}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-800">Status</h4>
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(selectedBooking.status)}`}>
                    {getStatusIcon(selectedBooking.status)}
                    <span className="capitalize">{selectedBooking.status}</span>
                  </span>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                {selectedBooking.status === 'pending' && (
                  <>
                    <GlassButton
                      onClick={() => {
                        handleStatusChange(selectedBooking.id, 'confirmed');
                        setShowDetailsModal(false);
                      }}
                      className="flex-1"
                    >
                      Accept
                    </GlassButton>
                    <GlassButton
                      variant="danger"
                      onClick={() => {
                        handleStatusChange(selectedBooking.id, 'cancelled');
                        setShowDetailsModal(false);
                      }}
                      className="flex-1"
                    >
                      Decline
                    </GlassButton>
                  </>
                )}

                {selectedBooking.status === 'confirmed' && (
                  <GlassButton
                    variant="success"
                    onClick={() => {
                      handleStatusChange(selectedBooking.id, 'completed');
                      setShowDetailsModal(false);
                    }}
                    className="flex-1"
                  >
                    Mark Complete
                  </GlassButton>
                )}

                <a href={`tel:${selectedBooking.customerPhone}`} className="flex-1">
                  <GlassButton variant="secondary" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Customer
                  </GlassButton>
                </a>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBookingsPage;
