'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import SalonOwnerHeader from '@/components/salon-owner/SalonOwnerHeader';
import GlassCard, { GlassButton } from '@/components/ui/GlassCard';
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  Download,
  Eye,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Percent,
  Clock,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Banknote
} from 'lucide-react';

// Mock data for earnings
const mockEarningsData = {
  overview: {
    totalEarnings: 125000,
    monthlyEarnings: 15000,
    weeklyEarnings: 3500,
    todayEarnings: 850,
    pendingPayouts: 2500,
    availableBalance: 12500,
    totalCommission: 18750,
    monthlyCommission: 2250
  },
  transactions: [
    {
      id: 'txn_001',
      type: 'earning',
      amount: 499,
      commission: 74.85,
      netAmount: 424.15,
      description: 'Premium Haircut - John Doe',
      bookingId: 'booking_001',
      date: '2024-01-25T14:30:00Z',
      status: 'completed'
    },
    {
      id: 'txn_002',
      type: 'payout',
      amount: 5000,
      description: 'Weekly payout to bank account',
      date: '2024-01-22T10:00:00Z',
      status: 'completed',
      reference: 'PAY_001'
    },
    {
      id: 'txn_003',
      type: 'earning',
      amount: 2499,
      commission: 374.85,
      netAmount: 2124.15,
      description: 'Hair Coloring - Sarah Wilson',
      bookingId: 'booking_002',
      date: '2024-01-24T11:30:00Z',
      status: 'completed'
    },
    {
      id: 'txn_004',
      type: 'commission',
      amount: 149.85,
      description: 'Platform commission - Facial Treatment',
      bookingId: 'booking_003',
      date: '2024-01-23T16:00:00Z',
      status: 'deducted'
    }
  ],
  monthlyData: [
    { month: 'Jan', earnings: 15000, commission: 2250 },
    { month: 'Dec', earnings: 14200, commission: 2130 },
    { month: 'Nov', earnings: 13800, commission: 2070 },
    { month: 'Oct', earnings: 12500, commission: 1875 },
    { month: 'Sep', earnings: 11200, commission: 1680 },
    { month: 'Aug', earnings: 10800, commission: 1620 }
  ]
};

const EarningsPage = () => {
  const { userData } = useAuth();
  const [earningsData, setEarningsData] = useState(mockEarningsData);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateFilter, setDateFilter] = useState('all');
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const commissionRate = userData?.earnings?.commissionRate || 0.15;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'payouts', label: 'Payouts', icon: Banknote }
  ];

  const dateFilters = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'earning':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <ArrowDownLeft className="w-4 h-4 text-green-600" />
          </div>
        );
      case 'payout':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 text-blue-600" />
          </div>
        );
      case 'commission':
        return (
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <Percent className="w-4 h-4 text-orange-600" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-gray-600" />
          </div>
        );
    }
  };

  const handlePayout = async () => {
    if (!payoutAmount || parseFloat(payoutAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (parseFloat(payoutAmount) > earningsData.overview.availableBalance) {
      alert('Insufficient balance for payout');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add payout transaction
      const newTransaction = {
        id: 'txn_' + Date.now(),
        type: 'payout',
        amount: parseFloat(payoutAmount),
        description: 'Payout request',
        date: new Date().toISOString(),
        status: 'pending',
        reference: 'PAY_' + Date.now()
      };

      setEarningsData(prev => ({
        ...prev,
        transactions: [newTransaction, ...prev.transactions],
        overview: {
          ...prev.overview,
          availableBalance: prev.overview.availableBalance - parseFloat(payoutAmount),
          pendingPayouts: prev.overview.pendingPayouts + parseFloat(payoutAmount)
        }
      }));

      setPayoutAmount('');
      setShowPayoutModal(false);
      alert('Payout request submitted successfully!');
    } catch (error) {
      alert('Failed to process payout request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <SalonOwnerHeader />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Earnings Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your revenue and manage payouts</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <GlassButton
              onClick={() => setShowPayoutModal(true)}
              className="flex items-center space-x-2"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Request Payout</span>
            </GlassButton>
            
            <GlassButton variant="secondary" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </GlassButton>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-800">₹{earningsData.overview.totalEarnings.toLocaleString()}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +12.5% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-800">₹{earningsData.overview.monthlyEarnings.toLocaleString()}</p>
                  <p className="text-sm text-blue-600 flex items-center mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    22 days active
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Available Balance</p>
                  <p className="text-2xl font-bold text-gray-800">₹{earningsData.overview.availableBalance.toLocaleString()}</p>
                  <p className="text-sm text-purple-600 flex items-center mt-1">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Ready for payout
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-red-500/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Commission Paid</p>
                  <p className="text-2xl font-bold text-gray-800">₹{earningsData.overview.totalCommission.toLocaleString()}</p>
                  <p className="text-sm text-orange-600 flex items-center mt-1">
                    <Percent className="w-4 h-4 mr-1" />
                    {(commissionRate * 100)}% platform fee
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                  <Percent className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Tabs */}
        <GlassCard>
          <div className="border-b border-white/20">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors
                      ${activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
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
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Earnings Chart */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Earnings Trend</h3>
                  <div className="space-y-3">
                    {earningsData.monthlyData.map((month, index) => (
                      <div key={month.month} className="flex items-center space-x-4">
                        <div className="w-12 text-sm font-medium text-gray-600">{month.month}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-700">₹{month.earnings.toLocaleString()}</span>
                            <span className="text-xs text-gray-500">Commission: ₹{month.commission.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full"
                              style={{ width: `${(month.earnings / 15000) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Commission Breakdown */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Commission Breakdown</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800">Platform Fee</h4>
                      <p className="text-2xl font-bold text-purple-600">{(commissionRate * 100)}%</p>
                      <p className="text-sm text-gray-600">On each booking</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800">Your Share</h4>
                      <p className="text-2xl font-bold text-green-600">{((1 - commissionRate) * 100)}%</p>
                      <p className="text-sm text-gray-600">After commission</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800">This Month</h4>
                      <p className="text-2xl font-bold text-orange-600">₹{earningsData.overview.monthlyCommission.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Commission paid</p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-white/20 rounded-lg">
                      <div className="text-2xl font-bold text-gray-800">{earningsData.overview.todayEarnings}</div>
                      <div className="text-sm text-gray-600">Today's Earnings</div>
                    </div>
                    
                    <div className="text-center p-4 bg-white/20 rounded-lg">
                      <div className="text-2xl font-bold text-gray-800">{earningsData.overview.weeklyEarnings}</div>
                      <div className="text-sm text-gray-600">This Week</div>
                    </div>
                    
                    <div className="text-center p-4 bg-white/20 rounded-lg">
                      <div className="text-2xl font-bold text-gray-800">{earningsData.overview.pendingPayouts}</div>
                      <div className="text-sm text-gray-600">Pending Payouts</div>
                    </div>
                    
                    <div className="text-center p-4 bg-white/20 rounded-lg">
                      <div className="text-2xl font-bold text-gray-800">85%</div>
                      <div className="text-sm text-gray-600">Payout Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Transaction History</h3>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="bg-white/20 backdrop-blur-lg border border-white/20 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  >
                    {dateFilters.map(filter => (
                      <option key={filter.value} value={filter.value}>{filter.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  {earningsData.transactions.map((transaction) => (
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
                          {transaction.bookingId && (
                            <p className="text-xs text-gray-500">Booking: {transaction.bookingId}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'earning' ? 'text-green-600' : 
                          transaction.type === 'payout' ? 'text-blue-600' : 'text-orange-600'
                        }`}>
                          {transaction.type === 'earning' && '+'}
                          {transaction.type === 'payout' && '-'}
                          {transaction.type === 'commission' && '-'}
                          ₹{transaction.amount.toFixed(2)}
                        </p>
                        {transaction.commission && (
                          <p className="text-xs text-gray-500">
                            Net: ₹{transaction.netAmount.toFixed(2)}
                          </p>
                        )}
                        <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                          transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payouts Tab */}
            {activeTab === 'payouts' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Payout Management</h3>
                  <GlassButton
                    onClick={() => setShowPayoutModal(true)}
                    disabled={earningsData.overview.availableBalance <= 0}
                  >
                    Request Payout
                  </GlassButton>
                </div>

                {/* Payout Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50/50 border border-green-200/50 rounded-lg p-4">
                    <h4 className="font-medium text-green-800">Available for Payout</h4>
                    <p className="text-2xl font-bold text-green-600">₹{earningsData.overview.availableBalance.toLocaleString()}</p>
                    <p className="text-sm text-green-600">Ready to withdraw</p>
                  </div>
                  
                  <div className="bg-yellow-50/50 border border-yellow-200/50 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800">Pending Payouts</h4>
                    <p className="text-2xl font-bold text-yellow-600">₹{earningsData.overview.pendingPayouts.toLocaleString()}</p>
                    <p className="text-sm text-yellow-600">Processing</p>
                  </div>
                  
                  <div className="bg-blue-50/50 border border-blue-200/50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800">This Month Paid</h4>
                    <p className="text-2xl font-bold text-blue-600">₹5,000</p>
                    <p className="text-sm text-blue-600">Successfully transferred</p>
                  </div>
                </div>

                {/* Payout History */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">Recent Payouts</h4>
                  <div className="space-y-3">
                    {earningsData.transactions
                      .filter(t => t.type === 'payout')
                      .map((payout) => (
                        <div key={payout.id} className="flex items-center justify-between p-4 bg-white/20 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <ArrowUpRight className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{payout.description}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(payout.date).toLocaleDateString()}
                              </p>
                              {payout.reference && (
                                <p className="text-xs text-gray-500">Ref: {payout.reference}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-semibold text-blue-600">₹{payout.amount.toFixed(2)}</p>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              payout.status === 'completed' ? 'bg-green-100 text-green-800' :
                              payout.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {payout.status}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Payout Settings */}
                <div className="bg-blue-50/50 border border-blue-200/50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Payout Information</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Minimum payout amount: ₹100</li>
                    <li>• Payouts are processed within 1-3 business days</li>
                    <li>• Bank charges (if any) will be deducted from payout amount</li>
                    <li>• Update your bank details in profile settings</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Payout Modal */}
        {showPayoutModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <GlassCard className="max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Request Payout</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Balance
                  </label>
                  <div className="text-2xl font-bold text-green-600">
                    ₹{earningsData.overview.availableBalance.toLocaleString()}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payout Amount
                  </label>
                  <input
                    type="number"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="100"
                    max={earningsData.overview.availableBalance}
                    className="w-full bg-white/20 backdrop-blur-lg border border-white/20 rounded-lg px-3 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                  />
                </div>

                <div className="text-sm text-gray-600">
                  <p>• Minimum amount: ₹100</p>
                  <p>• Processing time: 1-3 business days</p>
                  <p>• Amount will be transferred to your registered bank account</p>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <GlassButton
                  onClick={() => setShowPayoutModal(false)}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </GlassButton>
                <GlassButton
                  onClick={handlePayout}
                  disabled={loading || !payoutAmount || parseFloat(payoutAmount) < 100}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Request Payout'
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

export default EarningsPage;
