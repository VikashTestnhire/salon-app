'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import UserHeader from '@/components/user/UserHeader';
import SearchFilters from '@/components/user/SearchFilters';
import SalonCard, { mockSalons } from '@/components/user/SalonCard';
import GlassCard from '@/components/ui/GlassCard';
import { MapPin, Clock, Star, TrendingUp, Heart } from 'lucide-react';

export default function UserDashboard() {
  const { user, userData } = useAuth();
  const [salons, setSalons] = useState(mockSalons);
  const [filteredSalons, setFilteredSalons] = useState(mockSalons);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  const handleSearch = async (searchParams) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      let filtered = [...salons];
      
      // Filter by search term
      if (searchParams.searchTerm) {
        filtered = filtered.filter(salon => 
          salon.name.toLowerCase().includes(searchParams.searchTerm.toLowerCase()) ||
          salon.serviceCategories.some(service => 
            service.toLowerCase().includes(searchParams.searchTerm.toLowerCase())
          )
        );
      }
      
      // Filter by location
      if (searchParams.location && searchParams.location !== 'Near me') {
        filtered = filtered.filter(salon => 
          salon.address.city.toLowerCase().includes(searchParams.location.toLowerCase()) ||
          salon.address.area.toLowerCase().includes(searchParams.location.toLowerCase())
        );
      }
      
      // Filter by services
      if (searchParams.services && searchParams.services.length > 0) {
        filtered = filtered.filter(salon =>
          searchParams.services.some(service =>
            salon.serviceCategories.includes(service.toLowerCase().replace(' ', '_'))
          )
        );
      }
      
      // Filter by price range
      if (searchParams.priceRange && searchParams.priceRange !== 'all') {
        const [min, max] = searchParams.priceRange.split('-').map(p => 
          p === '+' ? Infinity : parseInt(p) || 0
        );
        filtered = filtered.filter(salon => {
          const price = salon.pricing.startingPrice;
          return max ? price >= min && price <= max : price >= min;
        });
      }
      
      // Filter by rating
      if (searchParams.rating && searchParams.rating !== 'all') {
        const minRating = parseFloat(searchParams.rating.replace('+', ''));
        filtered = filtered.filter(salon => salon.ratings.average >= minRating);
      }
      
      // Sort results
      switch (searchParams.sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.pricing.startingPrice - b.pricing.startingPrice);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.pricing.startingPrice - a.pricing.startingPrice);
          break;
        case 'rating':
          filtered.sort((a, b) => b.ratings.average - a.ratings.average);
          break;
        case 'popular':
          filtered.sort((a, b) => b.ratings.totalReviews - a.ratings.totalReviews);
          break;
        default:
          break;
      }
      
      setFilteredSalons(filtered);
      setLoading(false);
    }, 1000);
  };

  const handleFiltersChange = (filters) => {
    // This would typically trigger a real-time filter without the search button
    // For now, we'll just store the filters
    console.log('Filters changed:', filters);
  };

  const handleFavorite = (salonId) => {
    setFavorites(prev => 
      prev.includes(salonId) 
        ? prev.filter(id => id !== salonId)
        : [...prev, salonId]
    );
  };

  const handleBookmark = (salonId) => {
    setBookmarks(prev => 
      prev.includes(salonId) 
        ? prev.filter(id => id !== salonId)
        : [...prev, salonId]
    );
  };

  const featuredSalons = salons.filter(salon => salon.isFeatured);
  const nearbySalons = salons.filter(salon => !salon.isFeatured).slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <UserHeader />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome back, {userData?.profile?.firstName}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Find and book your next appointment with ease
              </p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{userData?.bookingHistory?.totalBookings || 0}</div>
                  <div className="text-gray-500">Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">₹{userData?.wallet?.balance?.toFixed(2) || '0.00'}</div>
                  <div className="text-gray-500">Wallet</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{userData?.loyaltyPoints || 0}</div>
                  <div className="text-gray-500">Points</div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Search and Filters */}
        <SearchFilters onSearch={handleSearch} onFiltersChange={handleFiltersChange} />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard className="p-4 text-center">
            <MapPin className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{filteredSalons.length}</div>
            <div className="text-sm text-gray-600">Salons Found</div>
          </GlassCard>
          
          <GlassCard className="p-4 text-center">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">4.5+</div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </GlassCard>
          
          <GlassCard className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">24/7</div>
            <div className="text-sm text-gray-600">Booking</div>
          </GlassCard>
          
          <GlassCard className="p-4 text-center">
            <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{favorites.length}</div>
            <div className="text-sm text-gray-600">Favorites</div>
          </GlassCard>
        </div>

        {/* Featured Salons */}
        {featuredSalons.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">✨ Featured Salons</h2>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSalons.map((salon) => (
                <SalonCard
                  key={salon.id}
                  salon={salon}
                  onFavorite={handleFavorite}
                  onBookmark={handleBookmark}
                  isFavorited={favorites.includes(salon.id)}
                  isBookmarked={bookmarks.includes(salon.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {loading ? 'Searching...' : `Search Results (${filteredSalons.length})`}
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Sort by:</span>
              <select className="bg-white/50 border border-white/20 rounded px-2 py-1 text-sm">
                <option>Highest Rated</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Nearest First</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <GlassCard key={i} className="p-4 animate-pulse">
                  <div className="h-48 bg-gray-300/50 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300/50 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300/50 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300/50 rounded w-2/3"></div>
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : filteredSalons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSalons.map((salon) => (
                <SalonCard
                  key={salon.id}
                  salon={salon}
                  onFavorite={handleFavorite}
                  onBookmark={handleBookmark}
                  isFavorited={favorites.includes(salon.id)}
                  isBookmarked={bookmarks.includes(salon.id)}
                />
              ))}
            </div>
          ) : (
            <GlassCard className="p-12 text-center">
              <div className="text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No salons found</h3>
                <p className="text-sm">Try adjusting your search criteria or location</p>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Load More */}
        {filteredSalons.length > 6 && (
          <div className="text-center">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
              Load More Salons
            </button>
          </div>
        )}
      </div>
      <div className='flex'>
          <p>asfafffffffffffffffffffffffffffffffff</p>
          <p>asfafffffffffffffffffffffffffffffffff</p>
        </div>
    </div>
  );
}
