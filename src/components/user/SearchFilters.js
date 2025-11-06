'use client';

import { useState } from 'react';
import { Search, MapPin, Filter, Star, DollarSign, Clock } from 'lucide-react';
import GlassCard, { GlassInput, GlassButton } from '@/components/ui/GlassCard';

const SearchFilters = ({ onSearch, onFiltersChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    services: [],
    priceRange: 'all',
    rating: 'all',
    availability: 'all',
    sortBy: 'rating'
  });

  const serviceCategories = [
    'Haircut', 'Hair Styling', 'Hair Coloring', 'Beard Grooming', 
    'Facials', 'Massage', 'Manicure', 'Pedicure', 'Eyebrow Threading'
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-500', label: '₹0 - ₹500' },
    { value: '500-1000', label: '₹500 - ₹1,000' },
    { value: '1000-2000', label: '₹1,000 - ₹2,000' },
    { value: '2000+', label: '₹2,000+' }
  ];

  const ratingOptions = [
    { value: 'all', label: 'All Ratings' },
    { value: '4+', label: '4+ Stars' },
    { value: '4.5+', label: '4.5+ Stars' }
  ];

  const sortOptions = [
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'distance', label: 'Nearest First' },
    { value: 'popular', label: 'Most Popular' }
  ];

  const handleSearch = () => {
    onSearch?.({ searchTerm, location, ...filters });
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleServiceToggle = (service) => {
    const newServices = filters.services.includes(service)
      ? filters.services.filter(s => s !== service)
      : [...filters.services, service];
    
    handleFilterChange('services', newServices);
  };

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <GlassCard className="p-6">
        <div className="space-y-4">
          {/* Search inputs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <GlassInput
                placeholder="Search salons, services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="md:col-span-4 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <GlassInput
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="md:col-span-3 flex space-x-2">
              <GlassButton
                onClick={handleSearch}
                className="flex-1 flex items-center justify-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </GlassButton>
              
              <GlassButton
                variant="secondary"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
              </GlassButton>
            </div>
          </div>

          {/* Quick location buttons */}
          <div className="flex flex-wrap gap-2">
            {['Near me', 'Mumbai', 'Delhi', 'Bangalore', 'Pune'].map((loc) => (
              <button
                key={loc}
                onClick={() => setLocation(loc === 'Near me' ? '' : loc)}
                className="px-3 py-1 bg-white/20 text-gray-700 rounded-full text-sm hover:bg-white/30 transition-colors"
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Advanced Filters */}
      {showFilters && (
        <GlassCard className="p-6">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Advanced Filters
            </h3>

            {/* Services */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Services
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {serviceCategories.map((service) => (
                  <label
                    key={service}
                    className={`
                      flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors
                      ${filters.services.includes(service) 
                        ? 'bg-blue-100/50 text-blue-800' 
                        : 'bg-white/20 text-gray-700 hover:bg-white/30'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={filters.services.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range, Rating, Sort - in a grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price Range */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Price Range
                </h4>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label
                      key={range.value}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="priceRange"
                        value={range.value}
                        checked={filters.priceRange === range.value}
                        onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  Rating
                </h4>
                <div className="space-y-2">
                  {ratingOptions.map((rating) => (
                    <label
                      key={rating.value}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={rating.value}
                        checked={filters.rating === rating.value}
                        onChange={(e) => handleFilterChange('rating', e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{rating.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Sort By
                </h4>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full bg-white/20 backdrop-blur-lg border border-white/20 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter actions */}
            <div className="flex justify-between items-center pt-4 border-t border-white/20">
              <button
                onClick={() => {
                  setFilters({
                    services: [],
                    priceRange: 'all',
                    rating: 'all',
                    availability: 'all',
                    sortBy: 'rating'
                  });
                  onFiltersChange?.({
                    services: [],
                    priceRange: 'all',
                    rating: 'all',
                    availability: 'all',
                    sortBy: 'rating'
                  });
                }}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear All
              </button>
              
              <div className="text-sm text-gray-600">
                {filters.services.length > 0 && (
                  <span>{filters.services.length} service(s) selected</span>
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default SearchFilters;
