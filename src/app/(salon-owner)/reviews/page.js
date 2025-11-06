'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import SalonOwnerHeader from '@/components/salon-owner/SalonOwnerHeader';
import GlassCard, { GlassButton } from '@/components/ui/GlassCard';
import { 
  Star,
  MessageSquare,
  TrendingUp,
  Filter,
  Search,
  Calendar,
  User,
  Reply,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  Flag,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

// Mock data for reviews
const mockReviews = [
  {
    id: 'review_001',
    customerName: 'John Doe',
    customerAvatar: '/api/placeholder/40/40',
    rating: 5,
    comment: 'Excellent service! Priya did an amazing job with my haircut. Very professional and friendly. The salon is clean and well-maintained. Will definitely come back!',
    serviceName: 'Premium Haircut & Styling',
    staffName: 'Priya Sharma',
    date: '2024-01-25T16:30:00Z',
    images: ['/api/placeholder/100/100', '/api/placeholder/100/100'],
    isVerified: true,
    helpfulVotes: 8,
    totalVotes: 10,
    response: null,
    status: 'published'
  },
  {
    id: 'review_002',
    customerName: 'Sarah Wilson',
    customerAvatar: '/api/placeholder/40/40',
    rating: 4,
    comment: 'Good experience overall. The hair coloring came out great and the staff was knowledgeable. However, the waiting time was a bit longer than expected.',
    serviceName: 'Hair Coloring',
    staffName: 'Raj Patel',
    date: '2024-01-24T14:20:00Z',
    images: [],
    isVerified: true,
    helpfulVotes: 5,
    totalVotes: 7,
    response: {
      text: 'Thank you for your feedback, Sarah! We apologize for the wait time and are working to improve our scheduling. We\'re glad you loved the hair coloring!',
      date: '2024-01-24T18:00:00Z',
      respondedBy: 'Salon Owner'
    },
    status: 'published'
  },
  {
    id: 'review_003',
    customerName: 'Mike Brown',
    customerAvatar: '/api/placeholder/40/40',
    rating: 3,
    comment: 'Average service. The beard trim was okay but nothing special. The place is clean but could use some improvement in customer service.',
    serviceName: 'Beard Grooming',
    staffName: 'Priya Sharma',
    date: '2024-01-23T11:45:00Z',
    images: [],
    isVerified: false,
    helpfulVotes: 2,
    totalVotes: 4,
    response: null,
    status: 'published'
  },
  {
    id: 'review_004',
    customerName: 'Lisa Chen',
    customerAvatar: '/api/placeholder/40/40',
    rating: 5,
    comment: 'Outstanding facial treatment! The therapist was very skilled and the products used were top quality. The ambiance was perfect for relaxation.',
    serviceName: 'Facial Treatment',
    staffName: 'Raj Patel',
    date: '2024-01-22T10:15:00Z',
    images: ['/api/placeholder/100/100'],
    isVerified: true,
    helpfulVotes: 12,
    totalVotes: 13,
    response: {
      text: 'Thank you so much for the wonderful review, Lisa! We\'re thrilled you enjoyed your facial treatment. Looking forward to serving you again!',
      date: '2024-01-22T15:30:00Z',
      respondedBy: 'Salon Owner'
    },
    status: 'published'
  },
  {
    id: 'review_005',
    customerName: 'Anonymous User',
    customerAvatar: '/api/placeholder/40/40',
    rating: 2,
    comment: 'Poor service and unprofessional behavior. The stylist seemed inexperienced and the final result was disappointing. Would not recommend.',
    serviceName: 'Hair Styling',
    staffName: 'Staff Member',
    date: '2024-01-21T13:30:00Z',
    images: [],
    isVerified: false,
    helpfulVotes: 1,
    totalVotes: 8,
    response: null,
    status: 'flagged'
  }
];

const ReviewsPage = () => {
  const { userData } = useAuth();
  const [reviews, setReviews] = useState(mockReviews);
  const [filteredReviews, setFilteredReviews] = useState(mockReviews);
  const [ratingFilter, setRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);

  const ratingFilters = [
    { value: 'all', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '2', label: '2 Stars' },
    { value: '1', label: '1 Star' }
  ];

  const statusFilters = [
    { value: 'all', label: 'All Reviews' },
    { value: 'published', label: 'Published' },
    { value: 'flagged', label: 'Flagged' },
    { value: 'responded', label: 'Responded' },
    { value: 'pending', label: 'Need Response' }
  ];

  useEffect(() => {
    filterReviews();
  }, [ratingFilter, statusFilter, searchTerm, reviews]);

  const filterReviews = () => {
    let filtered = [...reviews];

    // Filter by rating
    if (ratingFilter !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(ratingFilter));
    }

    // Filter by status
    if (statusFilter !== 'all') {
      if (statusFilter === 'responded') {
        filtered = filtered.filter(review => review.response !== null);
      } else if (statusFilter === 'pending') {
        filtered = filtered.filter(review => review.response === null && review.status === 'published');
      } else {
        filtered = filtered.filter(review => review.status === statusFilter);
      }
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(review => 
        review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.staffName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredReviews(filtered);
  };

  const getOverallStats = () => {
    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length
    };
    const responseRate = (reviews.filter(r => r.response !== null).length / totalReviews) * 100;
    const pendingResponses = reviews.filter(r => r.response === null && r.status === 'published').length;

    return {
      totalReviews,
      averageRating: averageRating.toFixed(1),
      ratingDistribution,
      responseRate: responseRate.toFixed(0),
      pendingResponses
    };
  };

  const handleResponse = async () => {
    if (!responseText.trim()) {
      alert('Please enter a response');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setReviews(prev => 
        prev.map(review => 
          review.id === selectedReview.id 
            ? {
                ...review,
                response: {
                  text: responseText,
                  date: new Date().toISOString(),
                  respondedBy: 'Salon Owner'
                }
              }
            : review
        )
      );

      setResponseText('');
      setShowResponseModal(false);
      setSelectedReview(null);
      alert('Response posted successfully!');
    } catch (error) {
      alert('Failed to post response');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, size = 'w-4 h-4') => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const stats = getOverallStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <SalonOwnerHeader />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reviews & Ratings</h1>
          <p className="text-gray-600 mt-1">Manage customer feedback and build your reputation</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{stats.averageRating}</div>
            <div className="text-sm text-gray-600">Average Rating</div>
            <div className="flex justify-center mt-2">
              {renderStars(Math.round(parseFloat(stats.averageRating)))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{stats.totalReviews}</div>
            <div className="text-sm text-gray-600">Total Reviews</div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Reply className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{stats.responseRate}%</div>
            <div className="text-sm text-gray-600">Response Rate</div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{stats.pendingResponses}</div>
            <div className="text-sm text-gray-600">Pending Responses</div>
          </GlassCard>
        </div>

        {/* Rating Distribution */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Rating Distribution</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 w-16">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                      style={{ 
                        width: `${stats.totalReviews > 0 ? (stats.ratingDistribution[rating] / stats.totalReviews) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm text-gray-600 w-8">
                  {stats.ratingDistribution[rating]}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Filters */}
        <GlassCard className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/20 backdrop-blur-lg border border-white/20 rounded-lg pl-10 pr-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
              />
            </div>

            {/* Rating Filter */}
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="bg-white/20 backdrop-blur-lg border border-white/20 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              {ratingFilters.map(filter => (
                <option key={filter.value} value={filter.value}>{filter.label}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/20 backdrop-blur-lg border border-white/20 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              {statusFilters.map(filter => (
                <option key={filter.value} value={filter.value}>{filter.label}</option>
              ))}
            </select>
          </div>
        </GlassCard>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <GlassCard key={review.id} className="p-6">
              <div className="space-y-4">
                {/* Review Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={review.customerAvatar}
                      alt={review.customerName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-800">{review.customerName}</h4>
                        {review.isVerified && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        {review.status === 'flagged' && (
                          <Flag className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-600">
                          {new Date(review.date).toLocaleDateString('en', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Service Info */}
                <div className="bg-gray-50/50 rounded-lg p-3">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span><strong>Service:</strong> {review.serviceName}</span>
                    <span><strong>Staff:</strong> {review.staffName}</span>
                  </div>
                </div>

                {/* Review Content */}
                <div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  
                  {/* Review Images */}
                  {review.images.length > 0 && (
                    <div className="flex space-x-2 mt-3">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Review image ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Helpful Votes */}
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <ThumbsUp className="w-4 h-4" />
                    <span>Helpful ({review.helpfulVotes}/{review.totalVotes})</span>
                  </div>
                </div>

                {/* Response Section */}
                {review.response ? (
                  <div className="bg-blue-50/50 border border-blue-200/50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Reply className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Response from {review.response.respondedBy}</span>
                      <span className="text-sm text-blue-600">
                        {new Date(review.response.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-blue-700">{review.response.text}</p>
                  </div>
                ) : review.status === 'published' && (
                  <div className="flex justify-end">
                    <GlassButton
                      onClick={() => {
                        setSelectedReview(review);
                        setShowResponseModal(true);
                      }}
                      variant="secondary"
                      className="text-sm"
                    >
                      <Reply className="w-4 h-4 mr-2" />
                      Respond
                    </GlassButton>
                  </div>
                )}
              </div>
            </GlassCard>
          ))}

          {filteredReviews.length === 0 && (
            <GlassCard className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No reviews found</h3>
              <p className="text-gray-600">
                {searchTerm || ratingFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your filters to see more reviews'
                  : 'Customer reviews will appear here when they start rating your services'
                }
              </p>
            </GlassCard>
          )}
        </div>

        {/* Response Modal */}
        {showResponseModal && selectedReview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <GlassCard className="max-w-2xl w-full p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Respond to Review</h3>
              
              {/* Original Review */}
              <div className="bg-gray-50/50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={selectedReview.customerAvatar}
                    alt={selectedReview.customerName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <h5 className="font-medium text-gray-800">{selectedReview.customerName}</h5>
                    <div className="flex items-center space-x-2">
                      {renderStars(selectedReview.rating)}
                      <span className="text-sm text-gray-600">{selectedReview.serviceName}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{selectedReview.comment}</p>
              </div>

              {/* Response Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Response
                  </label>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Thank you for your feedback..."
                    rows={4}
                    className="w-full bg-white/20 backdrop-blur-lg border border-white/20 rounded-lg px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    Be professional, courteous, and constructive in your response.
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <GlassButton
                  onClick={() => {
                    setShowResponseModal(false);
                    setSelectedReview(null);
                    setResponseText('');
                  }}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </GlassButton>
                <GlassButton
                  onClick={handleResponse}
                  disabled={loading || !responseText.trim()}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Posting...
                    </>
                  ) : (
                    'Post Response'
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

export default ReviewsPage;
