'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import UserHeader from '@/components/user/UserHeader';
import GlassCard, { GlassButton } from '@/components/ui/GlassCard';
import { 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  Globe,
  Heart,
  Share,
  Camera,
  CheckCircle,
  Wifi,
  Car,
  CreditCard,
  Shield,
  Users,
  Calendar,
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Mock data for salon details
const mockSalonDetail = {
  id: 'salon_67890',
  name: 'Elite Hair Studio',
  description: 'Premium hair and beauty services with experienced professionals. We offer a wide range of services from classic haircuts to modern styling, all in a luxurious and hygienic environment.',
  images: [
    '/api/placeholder/800/400',
    '/api/placeholder/800/400',
    '/api/placeholder/800/400',
    '/api/placeholder/800/400'
  ],
  address: {
    street: '456 Fashion Street',
    area: 'Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    coordinates: { latitude: 19.0520, longitude: 72.8310 },
    landmarks: 'Near Linking Road Metro Station'
  },
  contact: {
    phone: '+91-9876543212',
    email: 'info@elitehair.com',
    website: 'https://elitehair.com'
  },
  operatingHours: {
    monday: { open: '09:00', close: '21:00', isOpen: true },
    tuesday: { open: '09:00', close: '21:00', isOpen: true },
    wednesday: { open: '09:00', close: '21:00', isOpen: true },
    thursday: { open: '09:00', close: '21:00', isOpen: true },
    friday: { open: '09:00', close: '21:00', isOpen: true },
    saturday: { open: '08:00', close: '22:00', isOpen: true },
    sunday: { open: '10:00', close: '20:00', isOpen: true }
  },
  amenities: ['wifi', 'ac', 'parking', 'card_payment', 'sanitization'],
  ratings: {
    average: 4.5,
    totalReviews: 156,
    distribution: { 5: 89, 4: 45, 3: 18, 2: 3, 1: 1 }
  },
  pricing: {
    startingPrice: 299,
    currency: 'INR',
    priceRange: 'affordable'
  },
  isVerified: true,
  isFeatured: false,
  staff: [
    {
      id: 'staff_1',
      name: 'Priya Sharma',
      designation: 'Senior Hair Stylist',
      experience: 5,
      rating: 4.7,
      specializations: ['Hair Cutting', 'Hair Styling', 'Hair Coloring'],
      avatar: '/api/placeholder/100/100'
    },
    {
      id: 'staff_2',
      name: 'Raj Patel',
      designation: 'Beard Specialist',
      experience: 3,
      rating: 4.5,
      specializations: ['Beard Grooming', 'Facial', 'Head Massage'],
      avatar: '/api/placeholder/100/100'
    }
  ],
  services: [
    {
      id: 'service_1',
      name: 'Premium Haircut & Styling',
      description: 'Professional haircut with styling and hair wash',
      price: 599,
      discountedPrice: 499,
      duration: 45,
      category: 'haircut'
    },
    {
      id: 'service_2',
      name: 'Beard Grooming Deluxe',
      description: 'Complete beard trimming, shaping and conditioning',
      price: 399,
      discountedPrice: 299,
      duration: 30,
      category: 'beard'
    },
    {
      id: 'service_3',
      name: 'Relaxing Head Massage',
      description: 'Stress-relieving head and scalp massage',
      price: 299,
      discountedPrice: null,
      duration: 20,
      category: 'massage'
    }
  ],
  reviews: [
    {
      id: 'review_1',
      customerName: 'John D.',
      rating: 5,
      comment: 'Excellent service! Priya did an amazing job with my haircut. Very professional and friendly.',
      date: '2024-01-21',
      serviceUsed: 'Premium Haircut & Styling'
    },
    {
      id: 'review_2',
      customerName: 'Mike S.',
      rating: 4,
      comment: 'Great place for beard grooming. Clean and hygienic environment.',
      date: '2024-01-20',
      serviceUsed: 'Beard Grooming Deluxe'
    }
  ]
};

export default function SalonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSalon(mockSalonDetail);
      setLoading(false);
    }, 1000);
  }, [params.salonId]);

  const isOpen = () => {
    if (!salon) return false;
    const now = new Date();
    const currentDay = now.toLocaleDateString('en', { weekday: 'long' }).toLowerCase();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const todayHours = salon.operatingHours[currentDay];
    if (!todayHours?.isOpen) return false;
    
    const [openHour, openMin] = todayHours.open.split(':').map(Number);
    const [closeHour, closeMin] = todayHours.close.split(':').map(Number);
    
    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;
    
    return currentTime >= openTime && currentTime <= closeTime;
  };

  const amenityIcons = {
    wifi: <Wifi className="w-5 h-5" />,
    ac: <span className="text-lg">❄️</span>,
    parking: <Car className="w-5 h-5" />,
    card_payment: <CreditCard className="w-5 h-5" />,
    sanitization: <Shield className="w-5 h-5" />
  };

  const amenityLabels = {
    wifi: 'Free Wi-Fi',
    ac: 'Air Conditioned',
    parking: 'Parking Available',
    card_payment: 'Card Payment',
    sanitization: 'Sanitized Environment'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <UserHeader />
        <div className="container mx-auto px-4 py-6">
          <GlassCard className="p-8 animate-pulse">
            <div className="space-y-4">
              <div className="h-8 bg-gray-300/50 rounded w-1/4"></div>
              <div className="h-64 bg-gray-300/50 rounded"></div>
              <div className="h-6 bg-gray-300/50 rounded w-3/4"></div>
              <div className="h-6 bg-gray-300/50 rounded w-1/2"></div>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <UserHeader />
        <div className="container mx-auto px-4 py-6">
          <GlassCard className="p-8 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Salon Not Found</h2>
            <p className="text-gray-600 mb-4">The salon you're looking for doesn't exist.</p>
            <GlassButton onClick={() => router.push('/dashboard')}>
              Back to Search
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
            <span>Back to Results</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <GlassCard className="overflow-hidden">
              <div className="relative">
                <div className="h-64 md:h-80 overflow-hidden">
                  <img
                    src={salon.images[currentImageIndex]}
                    alt={salon.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Image Navigation */}
                {salon.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                      disabled={currentImageIndex === 0}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(Math.min(salon.images.length - 1, currentImageIndex + 1))}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                      disabled={currentImageIndex === salon.images.length - 1}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {salon.images.length}
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {salon.isVerified && (
                    <span className="bg-green-500/80 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
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

                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`p-2 rounded-full backdrop-blur-lg transition-colors ${
                      isFavorited 
                        ? 'bg-red-500/80 text-white' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-lg transition-colors">
                    <Share className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Image Thumbnails */}
              {salon.images.length > 1 && (
                <div className="p-4">
                  <div className="flex space-x-2 overflow-x-auto">
                    {salon.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          index === currentImageIndex ? 'border-blue-500' : 'border-white/20'
                        }`}
                      >
                        <img src={image} alt={`${salon.name} ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>

            {/* Salon Info */}
            <GlassCard className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">{salon.name}</h1>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="font-semibold">{salon.ratings.average}</span>
                        <span className="text-gray-500">({salon.ratings.totalReviews} reviews)</span>
                      </div>
                      <span className="text-gray-500">•</span>
                      <span className="text-green-600 font-medium">From ₹{salon.pricing.startingPrice}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600">{salon.description}</p>

                {/* Location */}
                <div className="flex items-start space-x-3 text-gray-600">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p>{salon.address.street}, {salon.address.area}</p>
                    <p>{salon.address.city}, {salon.address.state} {salon.address.pincode}</p>
                    <p className="text-sm text-gray-500">{salon.address.landmarks}</p>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex items-center space-x-6">
                  <a 
                    href={`tel:${salon.contact.phone}`}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                  >
                    <Phone className="w-5 h-5" />
                    <span>{salon.contact.phone}</span>
                  </a>
                  {salon.contact.website && (
                    <a 
                      href={salon.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <Globe className="w-5 h-5" />
                      <span>Website</span>
                    </a>
                  )}
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {salon.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2 text-gray-600">
                        {amenityIcons[amenity]}
                        <span className="text-sm">{amenityLabels[amenity]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Tabs */}
            <GlassCard>
              <div className="border-b border-white/20">
                <nav className="flex space-x-8 px-6">
                  {['overview', 'services', 'staff', 'reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Operating Hours</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {Object.entries(salon.operatingHours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between items-center py-2">
                            <span className="capitalize font-medium text-gray-700">{day}</span>
                            <span className="text-gray-600">
                              {hours.isOpen ? `${hours.open} - ${hours.close}` : 'Closed'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Services Tab */}
                {activeTab === 'services' && (
                  <div className="space-y-4">
                    {salon.services.map((service) => (
                      <div key={service.id} className="border border-white/20 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{service.name}</h4>
                            <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">{service.duration} mins</span>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="flex items-center space-x-2">
                              {service.discountedPrice ? (
                                <>
                                  <span className="text-lg font-bold text-green-600">₹{service.discountedPrice}</span>
                                  <span className="text-sm text-gray-500 line-through">₹{service.price}</span>
                                </>
                              ) : (
                                <span className="text-lg font-bold text-gray-800">₹{service.price}</span>
                              )}
                            </div>
                            <Link href={`/book-appointment/${salon.id}?service=${service.id}`}>
                              <GlassButton className="mt-2 text-sm py-1 px-4">
                                Book Now
                              </GlassButton>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Staff Tab */}
                {activeTab === 'staff' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {salon.staff.map((member) => (
                      <div key={member.id} className="border border-white/20 rounded-lg p-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{member.name}</h4>
                            <p className="text-sm text-gray-600">{member.designation}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">{member.rating}</span>
                              <span className="text-sm text-gray-500">• {member.experience} years exp.</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 mb-2">Specializations:</p>
                          <div className="flex flex-wrap gap-1">
                            {member.specializations.map((spec) => (
                              <span
                                key={spec}
                                className="bg-blue-100/60 text-blue-800 text-xs px-2 py-1 rounded-full"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">Customer Reviews</h3>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-800">{salon.ratings.average}</div>
                          <div className="flex items-center justify-end">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">({salon.ratings.totalReviews})</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {salon.reviews.map((review) => (
                        <div key={review.id} className="border border-white/20 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h5 className="font-medium text-gray-800">{review.customerName}</h5>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-4 h-4 ${
                                        star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">• {review.serviceUsed}</span>
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <p className="text-gray-600 text-sm">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="space-y-6">
            <GlassCard className="p-6 sticky top-6">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-800">Book Appointment</h3>
                  <p className="text-sm text-gray-600">Starting from ₹{salon.pricing.startingPrice}</p>
                </div>

                <div className="space-y-3">
                  <Link href={`/book-appointment/${salon.id}`}>
                    <GlassButton className="w-full py-3">
                      <Calendar className="w-5 h-5 mr-2" />
                      Book Now
                    </GlassButton>
                  </Link>
                  
                  <a href={`tel:${salon.contact.phone}`}>
                    <GlassButton variant="secondary" className="w-full py-3">
                      <Phone className="w-5 h-5 mr-2" />
                      Call Salon
                    </GlassButton>
                  </a>
                </div>

                <div className="pt-4 border-t border-white/20">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Instant confirmation</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Quick Info */}
            <GlassCard className="p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Quick Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Staff</span>
                  <span className="text-gray-800">{salon.staff.length} professionals</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Services</span>
                  <span className="text-gray-800">{salon.services.length} services</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price Range</span>
                  <span className="text-gray-800 capitalize">{salon.pricing.priceRange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-medium ${isOpen() ? 'text-green-600' : 'text-red-600'}`}>
                    {isOpen() ? 'Open Now' : 'Closed'}
                  </span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
