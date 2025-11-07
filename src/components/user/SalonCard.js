'use client';

import Link from 'next/link';
import { Star, MapPin, Clock, Heart, Bookmark, Phone } from 'lucide-react';
import GlassCard, { GlassButton } from '@/components/ui/GlassCard';
import Image from 'next/image';

const SalonCard = ({ salon, onFavorite, onBookmark, isFavorited = false, isBookmarked = false }) => {
  const {
    id,
    name,
    images,
    address,
    ratings,
    pricing,
    serviceCategories,
    operatingHours,
    isVerified,
    isFeatured,
    contact
  } = salon;

  const isOpen = () => {
    const now = new Date();
    const currentDay = now.toLocaleDateString("en-US", { weekday: "short" }).toLowerCase()
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const todayHours = operatingHours?.[currentDay];
    if (!todayHours?.isOpen) return false;
    
    const [openHour, openMin] = todayHours.open.split(':').map(Number);
    const [closeHour, closeMin] = todayHours.close.split(':').map(Number);
    
    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;
    
    return currentTime >= openTime && currentTime <= closeTime;
  };

  const getNextOpenTime = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    
    for (let i = 0; i < 7; i++) {
      const dayIndex = (today + i) % 7;
      const dayName = days[dayIndex];
      const dayHours = operatingHours?.[dayName];
      
      if (dayHours?.isOpen) {
        const dayLabel = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayName;
        return `${dayLabel} ${dayHours.open}`;
      }
    }
    
    return 'Call for hours';
  };

  return (
    <GlassCard className="overflow-hidden hover:scale-105 transition-transform duration-300 group">
      <div className="relative">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={images?.[0] || '/api/placeholder/400/200'}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            width={400}
            height={200}
          />
          
          {/* Overlay with badges */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {isFeatured && (
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Featured
              </span>
            )}
            {isVerified && (
              <span className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Verified
              </span>
            )}
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              isOpen() 
                ? 'bg-green-500/80 text-white' 
                : 'bg-red-500/80 text-white'
            }`}>
              {isOpen() ? 'Open' : 'Closed'}
            </span>
          </div>

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                onFavorite?.(id);
              }}
              className={`p-2 rounded-full backdrop-blur-lg transition-colors ${
                isFavorited 
                  ? 'bg-red-500/80 text-white' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                onBookmark?.(id);
              }}
              className={`p-2 rounded-full backdrop-blur-lg transition-colors ${
                isBookmarked 
                  ? 'bg-blue-500/80 text-white' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Price range */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-black/60 text-white text-sm px-3 py-1 rounded-full backdrop-blur-lg">
              From ₹{pricing?.startingPrice}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title and rating */}
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-800 truncate">{name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium text-gray-700">{ratings?.average}</span>
                  <span className="text-gray-500 text-sm">({ratings?.totalReviews})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm truncate">{address?.area}, {address?.city}</span>
          </div>

          {/* Operating hours */}
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">
              {isOpen() ? `Open until ${operatingHours?.[new Date().toLocaleLowerCase().slice(0, 3)]?.close}` : getNextOpenTime()}
            </span>
          </div>

          {/* Services */}
          <div className="flex flex-wrap gap-1">
            {serviceCategories?.slice(0, 3).map((service) => (
              <span
                key={service}
                className="bg-blue-100/60 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {service}
              </span>
            ))}
            {serviceCategories?.length > 3 && (
              <span className="bg-gray-100/60 text-gray-600 text-xs px-2 py-1 rounded-full">
                +{serviceCategories.length - 3} more
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-2">
            <Link href={`/salon/${id}`} className="flex-1">
              <GlassButton className="w-full text-sm py-2">
                View Details
              </GlassButton>
            </Link>
            
            <Link href={`/book-appointment/${id}`} className="flex-1">
              <GlassButton variant="success" className="w-full text-sm py-2">
                Book Now
              </GlassButton>
            </Link>

            <a
              href={`tel:${contact?.phone}`}
              className="p-2 bg-green-100/60 text-green-700 rounded-lg hover:bg-green-200/60 transition-colors"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default SalonCard;

// Mock data for demo
export const mockSalons = [
  {
    id: 'salon_67890',
    name: 'Elite Hair Studio',
    images: ['/api/placeholder/400/200'],
    address: {
      area: 'Bandra West',
      city: 'Mumbai',
      coordinates: { latitude: 19.0520, longitude: 72.8310 }
    },
    ratings: {
      average: 4.5,
      totalReviews: 156
    },
    pricing: {
      startingPrice: 299,
      priceRange: 'affordable'
    },
    serviceCategories: ['haircut', 'hair_styling', 'beard_grooming', 'facials'],
    operatingHours: {
      monday: { open: '09:00', close: '21:00', isOpen: true },
      tuesday: { open: '09:00', close: '21:00', isOpen: true },
      wednesday: { open: '09:00', close: '21:00', isOpen: true },
      thursday: { open: '09:00', close: '21:00', isOpen: true },
      friday: { open: '09:00', close: '21:00', isOpen: true },
      saturday: { open: '08:00', close: '22:00', isOpen: true },
      sunday: { open: '10:00', close: '20:00', isOpen: true }
    },
    contact: {
      phone: '+91-9876543212'
    },
    isVerified: true,
    isFeatured: false
  },
  {
    id: 'salon_12345',
    name: 'Glamour Zone',
    images: ['/api/placeholder/400/200'],
    address: {
      area: 'Koramangala',
      city: 'Bangalore',
      coordinates: { latitude: 12.9279, longitude: 77.6271 }
    },
    ratings: {
      average: 4.8,
      totalReviews: 243
    },
    pricing: {
      startingPrice: 450,
      priceRange: 'premium'
    },
    serviceCategories: ['hair_coloring', 'facials', 'massage', 'manicure'],
    operatingHours: {
      monday: { open: '10:00', close: '20:00', isOpen: true },
      tuesday: { open: '10:00', close: '20:00', isOpen: true },
      wednesday: { open: '10:00', close: '20:00', isOpen: true },
      thursday: { open: '10:00', close: '20:00', isOpen: true },
      friday: { open: '10:00', close: '20:00', isOpen: true },
      saturday: { open: '09:00', close: '21:00', isOpen: true },
      sunday: { open: '11:00', close: '19:00', isOpen: true }
    },
    contact: {
      phone: '+91-9876543213'
    },
    isVerified: true,
    isFeatured: true
  }
];
