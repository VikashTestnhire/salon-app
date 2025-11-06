'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import UserHeader from '@/components/user/UserHeader';
import GlassCard, { GlassButton } from '@/components/ui/GlassCard';
import { 
  Wallet, 
  CreditCard, 
  Plus, 
  Minus,
  TrendingUp,
  Gift,
  Clock,
  Star,
  Copy,
  Check,
  ArrowUpRight,
  ArrowDownLeft,
  Zap,
  Award,
  Percent,
  Calendar,
  ShoppingBag
} from 'lucide-react';

// Mock data for wallet and offers
const mockTransactions = [
  {
    id: 'txn_001',
    type: 'credit',
    amount: 100,
    description: 'Cashback from booking at Elite Hair Studio',
    date: '2024-01-20T14:30:00Z',
    bookingId: 'booking_001'
  },
  {
    id: 'txn_002',
    type: 'debit',
    amount: 50,
    description: 'Used wallet for booking at Glamour Zone',
    date: '2024-01-18T16:00:00Z',
    bookingId: 'booking_002'
  },
  {
    id: 'txn_003',
    type: 'credit',
    amount: 200,
    description: 'Wallet recharge',
    date: '2024-01-15T10:15:00Z'
  },
  {
    id: 'txn_004',
    type: 'credit',
    amount: 75,
    description: 'Referral bonus',
    date: '2024-01-12T09:20:00Z'
  }
];

const mockOffers = [
  {
    id: 'offer_001',
    title: 'First Booking Offer',
    description: '20% off on your first salon booking',
    discount: 20,
    type: 'percentage',
    code: 'FIRST20',
    validUntil: '2024-02-29',
    terms: 'Valid for first-time users only. Maximum discount ₹500.',
    minAmount: 300,
    maxDiscount: 500,
    category: 'first-time',
    isActive: true,
    used: false
  },
  {
    id: 'offer_002',
    title: 'Weekend Special',
    description: '₹100 off on weekend bookings',
    discount: 100,
    type: 'flat',
    code: 'WEEKEND',
    validUntil: '2024-01-31',
    terms: 'Valid only on Saturday and Sunday bookings. Minimum booking value ₹500.',
    minAmount: 500,
    category: 'weekend',
    isActive: true,
    used: false
  },
  {
    id: 'offer_003',
    title: 'Loyalty Reward',
    description: '15% off for premium members',
    discount: 15,
    type: 'percentage',
    code: 'PREMIUM15',
    validUntil: '2024-03-31',
    terms: 'Valid for premium members only. No minimum booking value.',
    minAmount: 0,
    maxDiscount: 300,
    category: 'loyalty',
    isActive: true,
    used: false
  },
  {
    id: 'offer_004',
    title: 'Refer & Earn',
    description: '₹75 cashback for each referral',
    discount: 75,
    type: 'flat',
    code: 'REFER75',
    validUntil: '2024-12-31',
    terms: 'Get ₹75 when your friend makes their first booking using your referral code.',
    category: 'referral',
    isActive: true,
    used: false
  }
];

const WalletPage = () => {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState('balance');
  const [transactions, setTransactions] = useState(mockTransactions);
  const [offers, setOffers] = useState(mockOffers);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');
  const [loyaltyPoints, setLoyaltyPoints] = useState(userData?.loyaltyPoints || 250);

  const quickRechargeAmounts = [100, 200, 500, 1000, 2000];

  const getTransactionIcon = (type) => {
    return type === 'credit' ? (
      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
        <ArrowDownLeft className="w-4 h-4 text-green-600" />
      </div>
    ) : (
      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
        <ArrowUpRight className="w-4 h-4 text-red-600" />
      </div>
    );
  };

  const copyPromoCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const handleRecharge = () => {
    if (rechargeAmount && parseFloat(rechargeAmount) > 0) {
      // Simulate payment and wallet update
      const newTransaction = {
        id: 'txn_' + Date.now(),
        type: 'credit',
        amount: parseFloat(rechargeAmount),
        description: 'Wallet recharge',
        date: new Date().toISOString()
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      setRechargeAmount('');
      setShowRechargeModal(false);
      
      // In a real app, this would update the user's wallet balance in the backend
      alert(`₹${rechargeAmount} has been added to your wallet!`);
    }
  };

  const getOfferIcon = (category) => {
    switch (category) {
      case 'first-time':
        return <Star className="w-6 h-6 text-yellow-500" />;
      case 'weekend':
        return <Calendar className="w-6 h-6 text-purple-500" />;
      case 'loyalty':
        return <Award className="w-6 h-6 text-blue-500" />;
      case 'referral':
        return <Gift className="w-6 h-6 text-green-500" />;
      default:
        return <Percent className="w-6 h-6 text-orange-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <UserHeader />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Wallet & Offers</h1>
          <p className="text-gray-600 mt-1">Manage your balance and explore exclusive deals</p>
        </div>

        {/* Wallet Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Wallet Balance */}
          <GlassCard className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Wallet Balance</p>
                  <p className="text-2xl font-bold text-gray-800">₹{userData?.wallet?.balance?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
              <GlassButton
                onClick={() => setShowRechargeModal(true)}
                className="w-full text-sm py-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Money
              </GlassButton>
            </div>
          </GlassCard>

          {/* Loyalty Points */}
          <GlassCard className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Loyalty Points</p>
                  <p className="text-2xl font-bold text-gray-800">{loyaltyPoints}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">1 point = ₹1 | Next 50 points for Gold tier</p>
            </div>
          </GlassCard>

          {/* Total Savings */}
          <GlassCard className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Savings</p>
                  <p className="text-2xl font-bold text-gray-800">₹{userData?.totalSavings || '425'}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">From offers & cashbacks this month</p>
            </div>
          </GlassCard>
        </div>

        {/* Tabs */}
        <GlassCard>
          <div className="border-b border-white/20">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'balance', label: 'Balance & History', icon: Wallet },
                { id: 'offers', label: 'Offers & Coupons', icon: Gift },
                { id: 'loyalty', label: 'Loyalty Program', icon: Award }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors
                      ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Balance & History Tab */}
            {activeTab === 'balance' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Transaction History</h3>
                  <GlassButton
                    onClick={() => setShowRechargeModal(true)}
                    className="text-sm py-2 px-4"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Money
                  </GlassButton>
                </div>

                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-white/20 rounded-lg">
                      <div className="flex items-center space-x-4">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <p className="font-medium text-gray-800">{transaction.description}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(transaction.date).toLocaleDateString('en', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {transactions.length === 0 && (
                  <div className="text-center py-12">
                    <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No transactions yet</h3>
                    <p className="text-gray-600 mb-6">Your wallet transaction history will appear here</p>
                    <GlassButton onClick={() => setShowRechargeModal(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Money to Wallet
                    </GlassButton>
                  </div>
                )}
              </div>
            )}

            {/* Offers & Coupons Tab */}
            {activeTab === 'offers' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Offers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {offers.filter(offer => offer.isActive && !offer.used).map((offer) => (
                      <div key={offer.id} className="border border-white/20 rounded-lg p-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full -mr-8 -mt-8"></div>
                        <div className="relative">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              {getOfferIcon(offer.category)}
                              <div>
                                <h4 className="font-semibold text-gray-800">{offer.title}</h4>
                                <p className="text-sm text-gray-600">{offer.description}</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-lg p-3 mb-3">
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-lg text-gray-800">{offer.code}</span>
                              <button
                                onClick={() => copyPromoCode(offer.code)}
                                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
                              >
                                {copiedCode === offer.code ? (
                                  <>
                                    <Check className="w-4 h-4" />
                                    <span className="text-sm">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4" />
                                    <span className="text-sm">Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600">
                                Valid until {new Date(offer.validUntil).toLocaleDateString()}
                              </span>
                            </div>
                            {offer.minAmount > 0 && (
                              <p className="text-gray-600">Minimum booking: ₹{offer.minAmount}</p>
                            )}
                            {offer.maxDiscount && (
                              <p className="text-gray-600">Maximum discount: ₹{offer.maxDiscount}</p>
                            )}
                          </div>

                          <details className="mt-3">
                            <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-700">
                              Terms & Conditions
                            </summary>
                            <p className="text-xs text-gray-500 mt-2">{offer.terms}</p>
                          </details>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Used Offers */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Used Offers</h3>
                  {offers.filter(offer => offer.used).length > 0 ? (
                    <div className="space-y-3">
                      {offers.filter(offer => offer.used).map((offer) => (
                        <div key={offer.id} className="flex items-center justify-between p-4 bg-gray-100/50 rounded-lg opacity-60">
                          <div className="flex items-center space-x-3">
                            {getOfferIcon(offer.category)}
                            <div>
                              <h4 className="font-medium text-gray-700">{offer.title}</h4>
                              <p className="text-sm text-gray-500">Used on {offer.usedDate}</p>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500 font-mono">{offer.code}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Gift className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">No offers used yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Loyalty Program Tab */}
            {activeTab === 'loyalty' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Silver Member</h3>
                  <p className="text-gray-600">You have {loyaltyPoints} loyalty points</p>
                </div>

                {/* Progress to next tier */}
                <GlassCard className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-700">Progress to Gold</span>
                    <span className="text-sm text-gray-600">{loyaltyPoints}/300 points</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                      style={{ width: `${(loyaltyPoints / 300) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Earn {300 - loyaltyPoints} more points to unlock Gold tier benefits!
                  </p>
                </GlassCard>

                {/* Membership Tiers */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">Membership Tiers</h4>
                  <div className="space-y-4">
                    {[
                      {
                        tier: 'Bronze',
                        points: '0-99',
                        benefits: ['Basic booking features', '2% cashback'],
                        color: 'from-orange-400 to-orange-600',
                        current: loyaltyPoints < 100
                      },
                      {
                        tier: 'Silver',
                        points: '100-299',
                        benefits: ['Priority booking', '5% cashback', 'Exclusive offers'],
                        color: 'from-gray-400 to-gray-600',
                        current: loyaltyPoints >= 100 && loyaltyPoints < 300
                      },
                      {
                        tier: 'Gold',
                        points: '300-599',
                        benefits: ['Free rescheduling', '10% cashback', 'Birthday specials'],
                        color: 'from-yellow-400 to-yellow-600',
                        current: loyaltyPoints >= 300 && loyaltyPoints < 600
                      },
                      {
                        tier: 'Platinum',
                        points: '600+',
                        benefits: ['Concierge service', '15% cashback', 'VIP treatment'],
                        color: 'from-purple-400 to-purple-600',
                        current: loyaltyPoints >= 600
                      }
                    ].map((tier) => (
                      <div 
                        key={tier.tier}
                        className={`
                          border-2 rounded-lg p-4 transition-all
                          ${tier.current 
                            ? 'border-blue-500 bg-blue-50/50' 
                            : 'border-white/20 bg-white/10'
                          }
                        `}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 bg-gradient-to-r ${tier.color} rounded-full flex items-center justify-center`}>
                            <Award className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h5 className="font-semibold text-gray-800">{tier.tier}</h5>
                              {tier.current && (
                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{tier.points} points</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {tier.benefits.map((benefit, index) => (
                                <span
                                  key={index}
                                  className="bg-gray-100/60 text-gray-700 text-xs px-2 py-1 rounded-full"
                                >
                                  {benefit}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* How to earn points */}
                <GlassCard className="p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">How to Earn Points</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Complete Bookings</p>
                        <p className="text-sm text-gray-600">Earn 1 point for every ₹10 spent</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Write Reviews</p>
                        <p className="text-sm text-gray-600">Get 10 points for each review</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Gift className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Refer Friends</p>
                        <p className="text-sm text-gray-600">Earn 50 points per successful referral</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Recharge Modal */}
        {showRechargeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <GlassCard className="max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Add Money to Wallet</h3>
              
              {/* Quick amounts */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">Quick select amount:</p>
                <div className="grid grid-cols-3 gap-2">
                  {quickRechargeAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setRechargeAmount(amount.toString())}
                      className={`
                        p-3 text-sm font-medium rounded-lg border-2 transition-all
                        ${rechargeAmount === amount.toString()
                          ? 'border-blue-500 bg-blue-50/50 text-blue-700'
                          : 'border-white/20 bg-white/10 text-gray-700 hover:border-blue-300'
                        }
                      `}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom amount */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or enter custom amount:
                </label>
                <input
                  type="number"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-white/20 backdrop-blur-lg border border-white/20 rounded-lg px-3 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                  min="10"
                  max="10000"
                />
              </div>

              <div className="flex space-x-3">
                <GlassButton
                  onClick={() => setShowRechargeModal(false)}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </GlassButton>
                <GlassButton
                  onClick={handleRecharge}
                  className="flex-1"
                  disabled={!rechargeAmount || parseFloat(rechargeAmount) < 10}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Add ₹{rechargeAmount || '0'}
                </GlassButton>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletPage;
