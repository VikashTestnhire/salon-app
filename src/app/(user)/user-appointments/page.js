'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import UserHeader from '@/components/user/UserHeader';
import GlassCard, { GlassButton } from '@/components/ui/GlassCard';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Star,
  Phone,
  Navigation,
  RotateCcw,
  X,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
  Download,
  RefreshCw
} from 'lucide-react';

// Mock data for appointments
const mockAppointments = [
  {
    id: 'booking_001',
    salonName: 'Elite Hair Studio',
    salonAddress: 'Bandra West, Mumbai',
    salonPhone: '+91-9876543212',
    salonRating: 4.5,
    date: '2024-01-25',
    time: '14:00',
    endTime: '14:45',
    services: [
      { name: 'Premium Haircut & Styling', duration: 45, price: 499 }
    ],
    staff: {
      name: 'Priya Sharma',
      designation: 'Senior Hair Stylist',
      rating: 4.7
    },
    status: 'upcoming',
    totalAmount: 499,
    paymentStatus: 'paid',
    bookingDate: '2024-01-20T10:30:00Z',
    canCancel: true,
    canReschedule: true
  },
  {
    id: 'booking_002',
    salonName: 'Glamour Zone',
    salonAddress: 'Koramangala, Bangalore',
    salonPhone: '+91-9876543213',
    salonRating: 4.8,
    date: '2024-01-15',
    time: '16:00',
    endTime: '16:30',
    services: [
      { name: 'Beard Grooming Deluxe', duration: 30, price: 299 }
    ],
    staff: {
      name: 'Raj Patel',
      designation: 'Beard Specialist',
      rating: 4.5
    },
    status: 'completed',
    totalAmount: 299,
    paymentStatus: 'paid',
    bookingDate: '2024-01-10T15:20:00Z',
    canCancel: false,
    canReschedule: false,
    review: {
      rating: 5,
      comment: 'Excellent service!'
    }
  },
  {
    id: 'booking_003',
    salonName: 'Style Studio',
    salonAddress: 'Connaught Place, Delhi',
    salonPhone: '+91-9876543214',
    salonRating: 4.2,
    date: '2024-01-10',
    time: '11:00',
    endTime: '11:20',
    services: [
      { name: 'Relaxing Head Massage', duration: 20, price: 199 }
    ],
    staff: {
      name: 'Amit Singh',
      designation: 'Massage Therapist',
      rating: 4.3
    },
    status: 'cancelled',
    totalAmount: 199,
    paymentStatus: 'refunded',
    bookingDate: '2024-01-08T09:15:00Z',
    canCancel: false,
    canReschedule: false,
    cancelledAt: '2024-01-09T12:00:00Z',
    refundAmount: 199
  }
];

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [filteredAppointments, setFilteredAppointments] = useState(mockAppointments);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const filters = [
    { id: 'all', label: 'All', count: appointments.length },
    { id: 'upcoming', label: 'Upcoming', count: appointments.filter(a => a.status === 'upcoming').length },
    { id: 'completed', label: 'Completed', count: appointments.filter(a => a.status === 'completed').length },
    { id: 'cancelled', label: 'Cancelled', count: appointments.filter(a => a.status === 'cancelled').length }
  ];

  useEffect(() => {
    filterAppointments();
  }, [activeFilter, searchTerm, appointments]);

  const filterAppointments = () => {
    let filtered = [...appointments];

    // Filter by status
    if (activeFilter !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === activeFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(appointment => 
        appointment.salonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.services.some(service => 
          service.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        appointment.staff.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredAppointments(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
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
      case 'upcoming':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const confirmCancelBooking = () => {
    if (selectedBooking) {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setAppointments(prev => 
          prev.map(appointment => 
            appointment.id === selectedBooking.id 
              ? { 
                  ...appointment, 
                  status: 'cancelled', 
                  canCancel: false, 
                  canReschedule: false,
                  cancelledAt: new Date().toISOString(),
                  paymentStatus: 'refunded',
                  refundAmount: appointment.totalAmount
                } 
              : appointment
          )
        );
        setShowCancelModal(false);
        setSelectedBooking(null);
        setLoading(false);
      }, 1500);
    }
  };

  const handleReschedule = (bookingId) => {
    // In a real app, this would navigate to a reschedule page
    alert(`Reschedule functionality for booking ${bookingId} would be implemented here`);
  };

  const handleRepeatBooking = (booking) => {
    // Navigate to booking page with pre-filled data
    localStorage.setItem('repeatBooking', JSON.stringify({
      salonId: booking.salonId || 'salon_67890',
      services: booking.services,
      staff: booking.staff
    }));
    // Navigate to booking page
    window.location.href = `/book-appointment/salon_67890`;
  };

  const isUpcoming = (date) => {
    return new Date(date) > new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <UserHeader />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Appointments</h1>
            <p className="text-gray-600 mt-1">Manage your salon bookings</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Link href="/dashboard">
              <GlassButton className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Book New Appointment</span>
              </GlassButton>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <GlassCard className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/20 backdrop-blur-lg border border-white/20 rounded-lg pl-10 pr-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${activeFilter === filter.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/20 text-gray-700 hover:bg-white/30'
                    }
                  `}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Appointments List */}
        {filteredAppointments.length > 0 ? (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <GlassCard key={appointment.id} className="p-6 hover:scale-102 transition-transform">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  {/* Appointment Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{appointment.salonName}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">{appointment.salonAddress}</span>
                          <span className="text-gray-400">•</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-gray-600">{appointment.salonRating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          <span className="capitalize">{appointment.status}</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Date & Time */}
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {new Date(appointment.date).toLocaleDateString('en', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-gray-600">{appointment.time} - {appointment.endTime}</p>
                        </div>
                      </div>

                      {/* Staff */}
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{appointment.staff.name}</p>
                          <p className="text-sm text-gray-600">{appointment.staff.designation}</p>
                        </div>
                      </div>

                      {/* Services */}
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-green-600 font-bold text-sm">₹</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">₹{appointment.totalAmount}</p>
                          <p className="text-sm text-gray-600">
                            {appointment.services.map(s => s.name).join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Special info for cancelled bookings */}
                    {appointment.status === 'cancelled' && (
                      <div className="bg-red-50/50 border border-red-200/50 rounded-lg p-3">
                        <p className="text-sm text-red-700">
                          Cancelled on {new Date(appointment.cancelledAt).toLocaleDateString()}
                          {appointment.refundAmount && (
                            <span> • Refund of ₹{appointment.refundAmount} processed</span>
                          )}
                        </p>
                      </div>
                    )}

                    {/* Review for completed bookings */}
                    {appointment.status === 'completed' && appointment.review && (
                      <div className="bg-green-50/50 border border-green-200/50 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= appointment.review.rating 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">"{appointment.review.comment}"</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 lg:ml-6">
                    {appointment.status === 'upcoming' && (
                      <>
                        <a href={`tel:${appointment.salonPhone}`}>
                          <GlassButton variant="secondary" className="w-full text-sm py-2">
                            <Phone className="w-4 h-4 mr-2" />
                            Call Salon
                          </GlassButton>
                        </a>
                        
                        <a 
                          href={`https://maps.google.com/?q=${encodeURIComponent(appointment.salonAddress)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <GlassButton variant="secondary" className="w-full text-sm py-2">
                            <Navigation className="w-4 h-4 mr-2" />
                            Get Directions
                          </GlassButton>
                        </a>

                        {appointment.canReschedule && (
                          <GlassButton 
                            onClick={() => handleReschedule(appointment.id)}
                            variant="secondary" 
                            className="w-full text-sm py-2"
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reschedule
                          </GlassButton>
                        )}

                        {appointment.canCancel && (
                          <GlassButton 
                            onClick={() => handleCancelBooking(appointment)}
                            variant="danger" 
                            className="w-full text-sm py-2"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </GlassButton>
                        )}
                      </>
                    )}

                    {appointment.status === 'completed' && (
                      <>
                        <GlassButton 
                          onClick={() => handleRepeatBooking(appointment)}
                          className="w-full text-sm py-2"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Book Again
                        </GlassButton>
                        
                        {!appointment.review && (
                          <GlassButton variant="secondary" className="w-full text-sm py-2">
                            <Star className="w-4 h-4 mr-2" />
                            Write Review
                          </GlassButton>
                        )}
                      </>
                    )}

                    {appointment.status === 'cancelled' && (
                      <GlassButton 
                        onClick={() => handleRepeatBooking(appointment)}
                        variant="secondary" 
                        className="w-full text-sm py-2"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Book Again
                      </GlassButton>
                    )}

                    <Link href={`/user-appointments/${appointment.id}`}>
                      <GlassButton variant="secondary" className="w-full text-sm py-2">
                        <Download className="w-4 h-4 mr-2" />
                        View Details
                      </GlassButton>
                    </Link>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <GlassCard className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {activeFilter === 'all' ? 'No appointments found' : `No ${activeFilter} appointments`}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : activeFilter === 'all' 
                ? "You haven't booked any appointments yet" 
                : `You don't have any ${activeFilter} appointments`
              }
            </p>
            <Link href="/dashboard">
              <GlassButton>
                <Calendar className="w-4 h-4 mr-2" />
                Book Your First Appointment
              </GlassButton>
            </Link>
          </GlassCard>
        )}

        {/* Cancel Confirmation Modal */}
        {showCancelModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <GlassCard className="max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Cancel Appointment</h3>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel your appointment at {selectedBooking.salonName} on{' '}
                {new Date(selectedBooking.date).toLocaleDateString()}?
              </p>

              <div className="bg-yellow-50/50 border border-yellow-200/50 rounded-lg p-3 mb-6">
                <p className="text-sm text-yellow-700">
                  <strong>Cancellation Policy:</strong> Free cancellation up to 24 hours before appointment. 
                  A full refund of ₹{selectedBooking.totalAmount} will be processed within 3-5 business days.
                </p>
              </div>

              <div className="flex space-x-3">
                <GlassButton
                  onClick={() => setShowCancelModal(false)}
                  variant="secondary"
                  className="flex-1"
                  disabled={loading}
                >
                  Keep Appointment
                </GlassButton>
                <GlassButton
                  onClick={confirmCancelBooking}
                  variant="danger"
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Cancelling...</span>
                    </div>
                  ) : (
                    'Cancel Appointment'
                  )}
                </GlassButton>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;
