'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UserHeader from '@/components/user/UserHeader';
import GlassCard, { GlassButton } from '@/components/ui/GlassCard';
import { 
  XCircle, 
  RefreshCw, 
  Home,
  Phone,
  Mail,
  AlertTriangle,
  CreditCard
} from 'lucide-react';

const PaymentFailedPage = () => {
  const router = useRouter();

  const handleRetryPayment = () => {
    router.back(); // Go back to payment page
  };

  const handleNewBooking = () => {
    router.push('/dashboard');
  };

  const commonIssues = [
    {
      issue: "Insufficient balance",
      solution: "Check your account balance and try again"
    },
    {
      issue: "Card expired or invalid",
      solution: "Verify your card details and expiry date"
    },
    {
      issue: "Network connectivity",
      solution: "Check your internet connection and retry"
    },
    {
      issue: "Bank server down",
      solution: "Try again later or use a different payment method"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <UserHeader />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Failed Message */}
        <div className="text-center">
          <GlassCard className="p-8 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Failed</h1>
            <p className="text-gray-600 mb-6">
              We couldnt process your payment. Dont worry, no amount has been deducted from your account.
            </p>
            
            <div className="bg-red-50/50 border border-red-200/50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-red-800 font-medium">
                  Your booking slot is still reserved for 10 minutes
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlassButton 
                onClick={handleRetryPayment}
                className="flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Retry Payment</span>
              </GlassButton>
              
              <GlassButton 
                variant="secondary" 
                onClick={handleNewBooking}
                className="flex items-center justify-center space-x-2"
              >
                <Home className="w-5 h-5" />
                <span>New Booking</span>
              </GlassButton>
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Common Issues */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-orange-500" />
              Common Issues & Solutions
            </h2>
            
            <div className="space-y-4">
              {commonIssues.map((item, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <h3 className="font-semibold text-gray-800">{item.issue}</h3>
                  <p className="text-sm text-gray-600">{item.solution}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50/50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Payment Tips</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Ensure you have sufficient balance</li>
                <li>• Check if international transactions are enabled</li>
                <li>• Try using a different browser or device</li>
                <li>• Clear browser cache and cookies</li>
              </ul>
            </div>
          </GlassCard>

          {/* Alternative Payment Methods */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <CreditCard className="w-6 h-6 mr-2 text-green-500" />
              Try Different Payment Method
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50/50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Credit/Debit Cards</p>
                  <p className="text-sm text-gray-600">Visa, Mastercard, Rupay</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50/50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">UPI</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">UPI Payments</p>
                  <p className="text-sm text-gray-600">PhonePe, GPay, Paytm UPI</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50/50 rounded-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-xs">BANK</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Net Banking</p>
                  <p className="text-sm text-gray-600">All major banks supported</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50/50 rounded-lg">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-xs">WALT</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Digital Wallets</p>
                  <p className="text-sm text-gray-600">Paytm, Amazon Pay, etc.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <GlassButton 
                onClick={handleRetryPayment}
                className="w-full"
              >
                Try Different Method
              </GlassButton>
            </div>
          </GlassCard>

          {/* Contact Support */}
          <GlassCard className="p-6 lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Still Having Issues?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Call Support</h3>
                <p className="text-gray-600 mb-4">Speak to our payment experts</p>
                <a href="tel:+918001234567" className="text-blue-600 font-medium">
                  +91 8001 234 567
                </a>
                <p className="text-sm text-gray-500 mt-1">Available 24/7</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Email Support</h3>
                <p className="text-gray-600 mb-4">Get help via email</p>
                <a href="mailto:support@salonbook.com" className="text-green-600 font-medium">
                  support@salonbook.com
                </a>
                <p className="text-sm text-gray-500 mt-1">Response within 2 hours</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50/50 border border-yellow-200/50 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Report This Issue</h3>
              <p className="text-sm text-yellow-700 mb-3">
                Help us improve by reporting this payment failure. Include your booking details and error message if any.
              </p>
              <button className="text-yellow-800 underline text-sm font-medium">
                Report Payment Issue
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Quick Actions */}
        <div className="max-w-2xl mx-auto">
          <GlassCard className="p-6">
            <h3 className="font-bold text-gray-800 mb-4 text-center">Quick Actions</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <GlassButton 
                onClick={handleRetryPayment}
                variant="success"
                className="text-sm py-3"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Payment
              </GlassButton>
              
              <Link href="/dashboard">
                <GlassButton variant="secondary" className="w-full text-sm py-3">
                  <Home className="w-4 h-4 mr-2" />
                  Browse Salons
                </GlassButton>
              </Link>
              
              <Link href="/user-appointments">
                <GlassButton variant="secondary" className="w-full text-sm py-3">
                  View Bookings
                </GlassButton>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
