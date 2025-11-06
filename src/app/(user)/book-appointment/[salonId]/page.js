'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import UserHeader from '@/components/user/UserHeader';
import GlassCard, { GlassButton } from '@/components/ui/GlassCard';
import { 
  Calendar,
  Clock,
  User,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  CreditCard,
  Wallet,
  ArrowLeft
} from 'lucide-react';

// Mock data for booking
const mockSalonBooking = {
  id: 'salon_67890',
  name: 'Elite Hair Studio',
  address: 'Bandra West, Mumbai',
  rating: 4.5,
  image: '/api/placeholder/400/200',
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
  staff: [
    {
      id: 'staff_1',
      name: 'Priya Sharma',
      designation: 'Senior Hair Stylist',
      rating: 4.7,
      avatar: '/api/placeholder/100/100',
      specializations: ['haircut', 'hair_styling']
    },
    {
      id: 'staff_2',
      name: 'Raj Patel',
      designation: 'Beard Specialist',
      rating: 4.5,
      avatar: '/api/placeholder/100/100',
      specializations: ['beard', 'massage']
    }
  ]
};

const generateTimeSlots = (date) => {
  const slots = [];
  const startHour = 9;
  const endHour = 21;
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const isAvailable = Math.random() > 0.3; // Random availability for demo
      slots.push({
        time,
        available: isAvailable,
        price: Math.random() > 0.5 ? 'peak' : 'normal'
      });
    }
  }
  
  return slots;
};

export default function BookAppointmentPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedService = searchParams.get('service');

  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // 1: Services, 2: Staff, 3: Date/Time, 4: Confirmation
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [specialRequests, setSpecialRequests] = useState('');

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSalon(mockSalonBooking);
      if (preSelectedService) {
        const service = mockSalonBooking.services.find(s => s.id === preSelectedService);
        if (service) {
          setSelectedServices([service]);
          setStep(2);
        }
      }
      setLoading(false);
    }, 1000);

    // Generate available dates (next 30 days)
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    setAvailableDates(dates);
  }, [params.salonId, preSelectedService]);

  useEffect(() => {
    if (selectedDate) {
      setAvailableSlots(generateTimeSlots(selectedDate));
    }
  }, [selectedDate]);

  const handleServiceToggle = (service) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.id === service.id);
      if (exists) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const getTotalDuration = () => {
    return selectedServices.reduce((total, service) => total + service.duration, 0);
  };

  const getTotalPrice = () => {
    return selectedServices.reduce((total, service) => 
      total + (service.discountedPrice || service.price), 0
    );
  };

  const getOriginalPrice = () => {
    return selectedServices.reduce((total, service) => total + service.price, 0);
  };

  const getSavings = () => {
    return getOriginalPrice() - getTotalPrice();
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const isAvailable = availableDates.some(d => d.toDateString() === date.toDateString());
      const isPast = date < new Date().setHours(0, 0, 0, 0);

      days.push(
        <button
          key={day}
          onClick={() => isAvailable && !isPast && handleDateSelect(date)}
          disabled={!isAvailable || isPast}
          className={`
            p-2 text-sm rounded-lg transition-colors w-full aspect-square flex items-center justify-center
            ${isSelected 
              ? 'bg-blue-500 text-white' 
              : isAvailable && !isPast
              ? 'hover:bg-blue-100 text-gray-700'
              : 'text-gray-300 cursor-not-allowed'
            }
            ${isToday ? 'ring-2 ring-blue-300' : ''}
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const handleBooking = () => {
    // Navigate to payment page with booking details
    const bookingData = {
      salonId: salon.id,
      services: selectedServices,
      staff: selectedStaff,
      date: selectedDate,
      time: selectedTime,
      specialRequests,
      totalPrice: getTotalPrice(),
      duration: getTotalDuration()
    };
    
    // Store booking data in localStorage for payment page
    localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
    router.push('/payment');
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
            </div>
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
            <span>Back to Salon</span>
          </button>
        </div>

        {/* Salon Header */}
        <GlassCard className="p-6">
          <div className="flex items-center space-x-4">
            <img
              src={salon.image}
              alt={salon.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-800">{salon.name}</h1>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{salon.address}</span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{salon.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Progress Steps */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            {[
              { number: 1, title: 'Services', icon: Clock },
              { number: 2, title: 'Staff', icon: User },
              { number: 3, title: 'Date & Time', icon: Calendar },
              { number: 4, title: 'Confirmation', icon: Check }
            ].map((stepItem, index) => {
              const Icon = stepItem.icon;
              const isActive = step === stepItem.number;
              const isCompleted = step > stepItem.number;
              
              return (
                <div key={stepItem.number} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full transition-colors
                    ${isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isActive 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}>
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                      {stepItem.title}
                    </p>
                  </div>
                  {index < 3 && (
                    <div className={`
                      w-12 h-1 mx-4 rounded transition-colors
                      ${step > stepItem.number ? 'bg-green-500' : 'bg-gray-200'}
                    `} />
                  )}
                </div>
              );
            })}
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <GlassCard className="p-6">
              {/* Step 1: Select Services */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800">Select Services</h2>
                  <div className="space-y-4">
                    {salon.services.map((service) => {
                      const isSelected = selectedServices.find(s => s.id === service.id);
                      return (
                        <div
                          key={service.id}
                          onClick={() => handleServiceToggle(service)}
                          className={`
                            border-2 rounded-lg p-4 cursor-pointer transition-all
                            ${isSelected 
                              ? 'border-blue-500 bg-blue-50/50' 
                              : 'border-white/20 hover:border-blue-300'
                            }
                          `}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <div className={`
                                  w-5 h-5 rounded border-2 flex items-center justify-center
                                  ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}
                                `}>
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <h3 className="font-semibold text-gray-800">{service.name}</h3>
                              </div>
                              <p className="text-gray-600 text-sm mt-2 ml-8">{service.description}</p>
                              <div className="flex items-center space-x-4 mt-3 ml-8">
                                <div className="flex items-center space-x-1 text-gray-600">
                                  <Clock className="w-4 h-4" />
                                  <span className="text-sm">{service.duration} mins</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              {service.discountedPrice ? (
                                <div className="space-y-1">
                                  <div className="text-lg font-bold text-green-600">₹{service.discountedPrice}</div>
                                  <div className="text-sm text-gray-500 line-through">₹{service.price}</div>
                                </div>
                              ) : (
                                <div className="text-lg font-bold text-gray-800">₹{service.price}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Select Staff */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800">Choose Your Stylist</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {salon.staff.map((staff) => {
                      const isSelected = selectedStaff?.id === staff.id;
                      const canPerformServices = selectedServices.every(service => 
                        staff.specializations.includes(service.category)
                      );
                      
                      return (
                        <div
                          key={staff.id}
                          onClick={() => canPerformServices && setSelectedStaff(staff)}
                          className={`
                            border-2 rounded-lg p-4 cursor-pointer transition-all
                            ${!canPerformServices 
                              ? 'border-gray-200 opacity-50 cursor-not-allowed' 
                              : isSelected 
                              ? 'border-blue-500 bg-blue-50/50' 
                              : 'border-white/20 hover:border-blue-300'
                            }
                          `}
                        >
                          <div className="flex items-center space-x-4">
                            <img
                              src={staff.avatar}
                              alt={staff.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800">{staff.name}</h3>
                              <p className="text-sm text-gray-600">{staff.designation}</p>
                              <div className="flex items-center space-x-1 mt-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-medium">{staff.rating}</span>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                          {!canPerformServices && (
                            <p className="text-xs text-red-500 mt-2">
                              Cannot perform selected services
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Select Date & Time */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800">Choose Date & Time</h2>
                  
                  {/* Calendar */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-800">Select Date</h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="font-medium text-gray-800 min-w-[120px] text-center">
                          {currentMonth.toLocaleDateString('en', { month: 'long', year: 'numeric' })}
                        </span>
                        <button
                          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1">
                      {renderCalendar()}
                    </div>
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-4">
                        Available Times for {selectedDate.toLocaleDateString()}
                      </h3>
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot.time}
                            onClick={() => slot.available && setSelectedTime(slot.time)}
                            disabled={!slot.available}
                            className={`
                              p-3 text-sm rounded-lg transition-colors border
                              ${!slot.available 
                                ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                                : selectedTime === slot.time
                                ? 'border-blue-500 bg-blue-500 text-white'
                                : 'border-white/20 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                              }
                            `}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Special Requests */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Special Requests (Optional)</h3>
                    <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Any special requests or preferences..."
                      className="w-full bg-white/20 backdrop-blur-lg border border-white/20 rounded-lg p-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800">Confirm Your Booking</h2>
                  
                  <div className="space-y-4">
                    {/* Services */}
                    <div className="border border-white/20 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Selected Services</h3>
                      {selectedServices.map((service) => (
                        <div key={service.id} className="flex justify-between items-center py-2">
                          <div>
                            <p className="font-medium text-gray-800">{service.name}</p>
                            <p className="text-sm text-gray-600">{service.duration} mins</p>
                          </div>
                          <p className="font-semibold text-gray-800">
                            ₹{service.discountedPrice || service.price}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Staff */}
                    <div className="border border-white/20 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Stylist</h3>
                      <div className="flex items-center space-x-3">
                        <img
                          src={selectedStaff.avatar}
                          alt={selectedStaff.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{selectedStaff.name}</p>
                          <p className="text-sm text-gray-600">{selectedStaff.designation}</p>
                        </div>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="border border-white/20 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Appointment Details</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-800">{selectedDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-800">{selectedTime}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-800">Duration: {getTotalDuration()} mins</span>
                        </div>
                      </div>
                    </div>

                    {/* Special Requests */}
                    {specialRequests && (
                      <div className="border border-white/20 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-800 mb-3">Special Requests</h3>
                        <p className="text-gray-600">{specialRequests}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </GlassCard>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <GlassCard className="p-6 sticky top-6">
              <h3 className="font-bold text-gray-800 mb-4">Booking Summary</h3>
              
              <div className="space-y-3">
                {selectedServices.map((service) => (
                  <div key={service.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{service.name}</span>
                    <span className="text-gray-800">₹{service.discountedPrice || service.price}</span>
                  </div>
                ))}
                
                {getSavings() > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Savings</span>
                    <span>-₹{getSavings()}</span>
                  </div>
                )}
                
                <hr className="border-white/20" />
                
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
                
                {getTotalDuration() > 0 && (
                  <div className="text-sm text-gray-600 text-center">
                    Total Duration: {getTotalDuration()} mins
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3">
                {step > 1 && (
                  <GlassButton
                    variant="secondary"
                    onClick={() => setStep(step - 1)}
                    className="w-full"
                  >
                    Previous Step
                  </GlassButton>
                )}
                
                <GlassButton
                  onClick={() => {
                    if (step < 4) {
                      setStep(step + 1);
                    } else {
                      handleBooking();
                    }
                  }}
                  disabled={
                    (step === 1 && selectedServices.length === 0) ||
                    (step === 2 && !selectedStaff) ||
                    (step === 3 && (!selectedDate || !selectedTime))
                  }
                  className="w-full"
                >
                  {step === 4 ? (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Proceed to Payment
                    </>
                  ) : (
                    `Continue to ${step === 1 ? 'Staff' : step === 2 ? 'Date & Time' : 'Confirmation'}`
                  )}
                </GlassButton>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
