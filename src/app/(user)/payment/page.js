'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import UserHeader from '@/components/user/UserHeader';
import GlassCard, { GlassButton } from '@/components/ui/GlassCard';
import { 
  CreditCard, 
  Wallet, 
  Smartphone,
  Building,
  Check,
  Calendar,
  Clock,
  User,
  MapPin,
  Star,
  Gift,
  AlertCircle,
  ArrowLeft,
  Shield
} from 'lucide-react';

const PaymentPage = () => {
  const router = useRouter();
  const { userData } = useAuth();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [useWallet, setUseWallet] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  useEffect(() => {
    // Get booking data from localStorage
    const savedBooking = localStorage.getItem('pendingBooking');
    if (savedBooking) {
      setBookingData(JSON.parse(savedBooking));
    } else {
      router.push('/dashboard');
    }
  }, [router]);

  const paymentMethods = [
    {
      id: 'razorpay',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, Rupay',
      icon: CreditCard,
      available: true
    },
    {
      id: 'upi',
      name: 'UPI',
      description: 'PhonePe, GPay, Paytm',
      icon: Smartphone,
      available: true
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      description: 'All major banks',
      icon: Building,
      available: true
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      description: 'Paytm, Amazon Pay',
      icon: Wallet,
      available: true
    }
  ];

  const promoCodes = {
    'FIRST20': { discount: 20, type: 'percentage', description: '20% off on first booking' },
    'SAVE100': { discount: 100, type: 'flat', description: '₹100 off on bookings above ₹500' },
    'WEEKEND': { discount: 15, type: 'percentage', description: '15% off on weekend bookings' }
  };

  const applyPromoCode = () => {
    const promo = promoCodes[promoCode.toUpperCase()];
    if (promo && bookingData) {
      let discount = 0;
      if (promo.type === 'percentage') {
        discount = (bookingData.totalPrice * promo.discount) / 100;
      } else {
        discount = promo.discount;
      }
      
      setPromoDiscount(Math.min(discount, bookingData.totalPrice));
      setPromoApplied(true);
    } else {
      alert('Invalid promo code');
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setPromoDiscount(0);
    setPromoApplied(false);
  };

  const getWalletUsage = () => {
    if (!useWallet || !userData?.wallet?.balance) return 0;
    const finalAmount = getFinalAmount();
    return Math.min(userData.wallet.balance, finalAmount);
  };

  const getFinalAmount = () => {
    if (!bookingData) return 0;
    return Math.max(0, bookingData.totalPrice - promoDiscount);
  };

  const getAmountToPay = () => {
    const finalAmount = getFinalAmount();
    const walletUsage = getWalletUsage();
    return Math.max(0, finalAmount - walletUsage);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!bookingData) return;

    setLoading(true);

    try {
      // For demo purposes, we'll simulate payment success
      // In real implementation, you'd create an order with your backend
      
      const amountToPay = getAmountToPay();
      
      if (amountToPay === 0) {
        // Full wallet payment
        await processBooking({ paymentMethod: 'wallet' });
        return;
      }

      // Load Razorpay script
      const res = await loadRazorpayScript();
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        setLoading(false);
        return;
      }

      // Create Razorpay order (simulate API call)
      const order = {
        id: 'order_' + Math.random().toString(36).substr(2, 9),
        amount: amountToPay * 100, // Razorpay expects amount in paise
        currency: 'INR'
      };

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_demo', // Demo key
        amount: order.amount,
        currency: order.currency,
        name: 'SalonBook',
        description: `Booking at ${bookingData.salonName || 'Salon'}`,
        order_id: order.id,
        handler: async function (response) {
          // Payment successful
          await processBooking({
            paymentMethod: 'razorpay',
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature
          });
        },
        prefill: {
          name: `${userData?.profile?.firstName} ${userData?.profile?.lastName}`,
          email: userData?.email,
          contact: userData?.profile?.phone
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const processBooking = async (paymentDetails) => {
    try {
      // Simulate booking creation API call
      const booking = {
        id: 'booking_' + Math.random().toString(36).substr(2, 9),
        ...bookingData,
        paymentDetails,
        finalAmount: getFinalAmount(),
        walletUsed: getWalletUsage(),
        promoApplied: promoApplied ? { code: promoCode, discount: promoDiscount } : null,
        status: 'confirmed',
        bookedAt: new Date().toISOString()
      };

      // Clear pending booking
      localStorage.removeItem('pendingBooking');

      // Redirect to success page
      localStorage.setItem('completedBooking', JSON.stringify(booking));
      router.push('/payment/success');

    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed. Please try again.');
      setLoading(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <UserHeader />
        <div className="container mx-auto px-4 py-6">
          <GlassCard className="p-8 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">No Booking Found</h2>
            <p className="text-gray-600 mb-4">Please start a new booking.</p>
            <GlassButton onClick={() => router.push('/dashboard')}>
              Back to Home
            </GlassButton>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <UserHeader />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Back Button */}
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Booking</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Wallet Balance */}
            {userData?.wallet?.balance > 0 && (
              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Wallet Balance</h3>
                      <p className="text-2xl font-bold text-green-600">₹{userData.wallet.balance.toFixed(2)}</p>
                    </div>
                  </div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useWallet}
                      onChange={(e) => setUseWallet(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Use wallet</span>
                  </label>
                </div>
                {useWallet && (
                  <div className="mt-4 p-3 bg-green-50/50 rounded-lg">
                    <p className="text-sm text-green-700">
                      ₹{getWalletUsage().toFixed(2)} will be deducted from your wallet
                    </p>
                  </div>
                )}
              </GlassCard>
            )}

            {/* Promo Code */}
            <GlassCard className="p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Gift className="w-5 h-5 mr-2" />
                Promo Code
              </h3>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter promo code"
                  disabled={promoApplied}
                  className="flex-1 bg-white/20 backdrop-blur-lg border border-white/20 rounded-lg px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 disabled:opacity-50"
                />
                {!promoApplied ? (
                  <GlassButton onClick={applyPromoCode} disabled={!promoCode.trim()}>
                    Apply
                  </GlassButton>
                ) : (
                  <GlassButton variant="danger" onClick={removePromoCode}>
                    Remove
                  </GlassButton>
                )}
              </div>
              {promoApplied && (
                <div className="mt-3 p-3 bg-green-50/50 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✅ Promo code applied! You saved ₹{promoDiscount.toFixed(2)}
                  </p>
                </div>
              )}
              
              {/* Available Promo Codes */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Available offers:</p>
                <div className="space-y-2">
                  {Object.entries(promoCodes).map(([code, promo]) => (
                    <div key={code} className="text-xs text-gray-500 bg-gray-50/50 p-2 rounded">
                      <strong>{code}</strong>: {promo.description}
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Payment Methods */}
            {getAmountToPay() > 0 && (
              <GlassCard className="p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Payment Method</h3>
                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <label
                        key={method.id}
                        className={`
                          flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-all
                          ${paymentMethod === method.id 
                            ? 'border-blue-500 bg-blue-50/50' 
                            : 'border-white/20 hover:border-blue-300'
                          }
                          ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          disabled={!method.available}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{method.name}</p>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                        {!method.available && (
                          <span className="text-xs text-red-500">Coming Soon</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </GlassCard>
            )}

            {/* Security Notice */}
            <GlassCard className="p-4">
              <div className="flex items-center space-x-2 text-green-600">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">Secure Payment</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Your payment is protected by 256-bit SSL encryption
              </p>
            </GlassCard>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            {/* Booking Details */}
            <GlassCard className="p-6 sticky top-6">
              <h3 className="font-bold text-gray-800 mb-4">Booking Summary</h3>
              
              {/* Salon Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-800">{bookingData.salonName || 'Elite Hair Studio'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-800">
                    {bookingData.date ? new Date(bookingData.date).toLocaleDateString() : 'Selected Date'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-800">{bookingData.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-800">{bookingData.staff?.name}</span>
                </div>
              </div>

              {/* Services */}
              <div className="space-y-3 mb-6">
                <h4 className="font-semibold text-gray-800">Services</h4>
                {bookingData.services?.map((service) => (
                  <div key={service.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{service.name}</span>
                    <span className="text-gray-800">₹{service.discountedPrice || service.price}</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">₹{bookingData.totalPrice}</span>
                </div>
                
                {promoApplied && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Promo ({promoCode})</span>
                    <span>-₹{promoDiscount.toFixed(2)}</span>
                  </div>
                )}
                
                {useWallet && getWalletUsage() > 0 && (
                  <div className="flex justify-between text-sm text-blue-600">
                    <span>Wallet</span>
                    <span>-₹{getWalletUsage().toFixed(2)}</span>
                  </div>
                )}
                
                <hr className="border-white/20" />
                
                <div className="flex justify-between font-semibold">
                  <span>Amount to Pay</span>
                  <span>₹{getAmountToPay().toFixed(2)}</span>
                </div>
              </div>

              {/* Pay Button */}
              <GlassButton
                onClick={handlePayment}
                disabled={loading}
                className="w-full py-3"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>
                      {getAmountToPay() === 0 ? 'Confirm Booking' : `Pay ₹${getAmountToPay().toFixed(2)}`}
                    </span>
                  </div>
                )}
              </GlassButton>

              {/* Terms */}
              <p className="text-xs text-gray-500 text-center mt-4">
                By proceeding, you agree to our Terms & Conditions and Cancellation Policy
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
