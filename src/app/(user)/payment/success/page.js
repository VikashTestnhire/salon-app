'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UserHeader from '@/components/user/UserHeader';
import GlassCard, { GlassButton } from '@/components/ui/GlassCard';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Phone,
  Download,
  Share,
  Star,
  Gift,
  Home
} from 'lucide-react';

const PaymentSuccessPage = () => {
  const router = useRouter();
  const [bookingData, setBookingData] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Get completed booking data
    const completedBooking = localStorage.getItem('completedBooking');
    if (completedBooking) {
      setBookingData(JSON.parse(completedBooking));
      setShowConfetti(true);
      
      // Clear after 3 seconds
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      router.push('/dashboard');
    }
  }, [router]);

  const handleDownloadReceipt = () => {
    // In a real app, this would generate and download a PDF receipt
    const receiptData = {
      bookingId: bookingData.id,
      salonName: bookingData.salonName || 'Elite Hair Studio',
      services: bookingData.services,
      date: bookingData.date,
      time: bookingData.time,
      totalAmount: bookingData.finalAmount,
      paymentMethod: bookingData.paymentDetails.paymentMethod
    };
    
    console.log('Downloading receipt:', receiptData);
    alert('Receipt download would start here in a real app');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Salon Booking Confirmed',
          text: `My appointment at ${bookingData.salonName || 'Elite Hair Studio'} is confirmed!`,
          url: window.location.origin + '/user-appointments/' + bookingData.id
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support native sharing
      if (navigator.clipboard) {
        navigator.clipboard.writeText(
          `My appointment at ${bookingData.salonName || 'Elite Hair Studio'} is confirmed! Booking ID: ${bookingData.id}`
        );
        alert('Booking details copied to clipboard!');
      }
    }
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <UserHeader />
        <div className="container mx-auto px-4 py-6">
          <GlassCard className="p-8 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Loading...</h2>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="confetti">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="confetti-piece"
                style={{
                  left: Math.random() * 100 + '%',
                  animationDelay: Math.random() * 3 + 's',
                  backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'][Math.floor(Math.random() * 6)]
                }}
              />
            ))}
          </div>
        </div>
      )}

      <UserHeader />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Success Message */}
        <div className="text-center">
          <GlassCard className="p-8 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Your appointment has been successfully booked. We've sent a confirmation to your email.
            </p>
            
            <div className="bg-green-50/50 border border-green-200/50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-2">
                <Gift className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">
                  You've earned 50 loyalty points!
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">Booking ID: {bookingData.id}</p>
              <p className="text-sm text-gray-500 mt-1">Save this ID for future reference</p>
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Appointment Details */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Appointment Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Salon Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800">Salon Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{bookingData.salonName || 'Elite Hair Studio'}</p>
                        <p className="text-sm text-gray-600">Bandra West, Mumbai</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">+91-9876543212</p>
                        <p className="text-sm text-gray-600">Contact salon</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Star className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">4.5 ⭐</p>
                        <p className="text-sm text-gray-600">156 reviews</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appointment Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800">Appointment Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {bookingData.date ? new Date(bookingData.date).toLocaleDateString('en', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'Selected Date'}
                        </p>
                        <p className="text-sm text-gray-600">Appointment date</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{bookingData.time}</p>
                        <p className="text-sm text-gray-600">Duration: {bookingData.duration} mins</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{bookingData.staff?.name}</p>
                        <p className="text-sm text-gray-600">{bookingData.staff?.designation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Services */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Services Booked</h2>
              <div className="space-y-4">
                {bookingData.services?.map((service, index) => (
                  <div key={service.id || index} className="flex justify-between items-center p-4 bg-gray-50/50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-800">{service.name}</h3>
                      <p className="text-sm text-gray-600">{service.description}</p>
                      <p className="text-sm text-gray-500">{service.duration} minutes</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">₹{service.discountedPrice || service.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Payment Summary */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">₹{bookingData.totalPrice}</span>
                </div>
                
                {bookingData.promoApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo ({bookingData.promoApplied.code})</span>
                    <span>-₹{bookingData.promoApplied.discount.toFixed(2)}</span>
                  </div>
                )}
                
                {bookingData.walletUsed > 0 && (
                  <div className="flex justify-between text-blue-600">
                    <span>Wallet Used</span>
                    <span>-₹{bookingData.walletUsed.toFixed(2)}</span>
                  </div>
                )}
                
                <hr className="border-gray-200" />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Paid</span>
                  <span>₹{bookingData.finalAmount.toFixed(2)}</span>
                </div>
                
                <div className="text-sm text-gray-600">
                  Payment Method: {bookingData.paymentDetails.paymentMethod === 'razorpay' ? 'Online Payment' : 'Wallet'}
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Next Steps */}
            <GlassCard className="p-6 sticky top-6">
              <h3 className="font-bold text-gray-800 mb-4">What's Next?</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Confirmation SMS</p>
                    <p className="text-sm text-gray-600">You'll receive an SMS with appointment details</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Reminder Alert</p>
                    <p className="text-sm text-gray-600">We'll remind you 2 hours before your appointment</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Visit Salon</p>
                    <p className="text-sm text-gray-600">Arrive 10 minutes early for your appointment</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Actions */}
            <GlassCard className="p-6">
              <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <GlassButton onClick={handleDownloadReceipt} className="w-full text-sm py-2">
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </GlassButton>
                
                <GlassButton onClick={handleShare} variant="secondary" className="w-full text-sm py-2">
                  <Share className="w-4 h-4 mr-2" />
                  Share Booking
                </GlassButton>
                
                <Link href="/user-appointments" className="block">
                  <GlassButton variant="secondary" className="w-full text-sm py-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    View All user-Appointments
                  </GlassButton>
                </Link>
                
                <Link href="/dashboard" className="block">
                  <GlassButton className="w-full text-sm py-2">
                    <Home className="w-4 h-4 mr-2" />
                    Back to Home
                  </GlassButton>
                </Link>
              </div>
            </GlassCard>

            {/* Cancellation Policy */}
            <GlassCard className="p-6">
              <h3 className="font-bold text-gray-800 mb-3">Cancellation Policy</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• Free cancellation up to 24 hours before appointment</p>
                <p>• 50% refund for cancellations 2-24 hours before</p>
                <p>• No refund for cancellations less than 2 hours before</p>
                <p>• Reschedule up to 2 times without additional charges</p>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Custom Confetti CSS */}
      <style jsx>{`
        .confetti {
          position: absolute;
          top: -10px;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          background: #FFD700;
          animation: confetti-fall 3s linear infinite;
        }
        
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccessPage;
