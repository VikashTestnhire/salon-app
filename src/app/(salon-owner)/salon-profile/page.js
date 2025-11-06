'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import SalonOwnerHeader from '@/components/salon-owner/SalonOwnerHeader';
import GlassCard, { GlassButton, GlassInput } from '@/components/ui/GlassCard';
import { 
  Store,
  Camera,
  Clock,
  MapPin,
  Phone,
  Globe,
  Users,
  DollarSign,
  Plus,
  X,
  Save,
  Upload,
  Star,
  Scissors,
  Palette
} from 'lucide-react';

const SalonProfilePage = () => {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [salonData, setSalonData] = useState({
    basic: {
      name: userData?.businessInfo?.businessName || '',
      description: '',
      phone: '',
      email: '',
      website: '',
      category: 'unisex'
    },
    address: {
      street: '',
      area: '',
      city: '',
      state: '',
      pincode: '',
      landmarks: ''
    },
    images: [],
    operatingHours: {
      monday: { isOpen: true, open: '09:00', close: '21:00' },
      tuesday: { isOpen: true, open: '09:00', close: '21:00' },
      wednesday: { isOpen: true, open: '09:00', close: '21:00' },
      thursday: { isOpen: true, open: '09:00', close: '21:00' },
      friday: { isOpen: true, open: '09:00', close: '21:00' },
      saturday: { isOpen: true, open: '08:00', close: '22:00' },
      sunday: { isOpen: true, open: '10:00', close: '20:00' }
    },
    services: [],
    staff: [],
    amenities: []
  });

  const [newService, setNewService] = useState({
    name: '',
    description: '',
    category: 'haircut',
    duration: 30,
    price: '',
    discountedPrice: ''
  });

  const [newStaff, setNewStaff] = useState({
    name: '',
    designation: '',
    experience: '',
    specializations: [],
    workingDays: []
  });

  const categories = [
    { value: 'mens', label: "Men's Salon" },
    { value: 'womens', label: "Women's Salon" },
    { value: 'unisex', label: 'Unisex Salon' },
    { value: 'spa', label: 'Spa & Wellness' }
  ];

  const serviceCategories = [
    'haircut', 'hair_styling', 'hair_coloring', 'beard_grooming',
    'facials', 'massage', 'manicure', 'pedicure', 'eyebrow_threading'
  ];

  const amenitiesList = [
    'wifi', 'ac', 'parking', 'card_payment', 'sanitization',
    'music', 'magazines', 'refreshments', 'waiting_area'
  ];

  const specializations = [
    'Hair Cutting', 'Hair Styling', 'Hair Coloring', 'Beard Grooming',
    'Facial Treatments', 'Massage Therapy', 'Nail Art', 'Eyebrow Threading'
  ];

  const weekDays = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  const handleInputChange = (section, field, value) => {
    setSalonData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleOperatingHoursChange = (day, field, value) => {
    setSalonData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    // In a real app, you'd upload to Firebase Storage
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSalonData(prev => ({
          ...prev,
          images: [...prev.images, e.target.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setSalonData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addService = () => {
    if (newService.name && newService.price) {
      setSalonData(prev => ({
        ...prev,
        services: [...prev.services, { ...newService, id: Date.now().toString() }]
      }));
      setNewService({
        name: '',
        description: '',
        category: 'haircut',
        duration: 30,
        price: '',
        discountedPrice: ''
      });
    }
  };

  const removeService = (id) => {
    setSalonData(prev => ({
      ...prev,
      services: prev.services.filter(service => service.id !== id)
    }));
  };

  const addStaff = () => {
    if (newStaff.name && newStaff.designation) {
      setSalonData(prev => ({
        ...prev,
        staff: [...prev.staff, { ...newStaff, id: Date.now().toString() }]
      }));
      setNewStaff({
        name: '',
        designation: '',
        experience: '',
        specializations: [],
        workingDays: []
      });
    }
  };

  const removeStaff = (id) => {
    setSalonData(prev => ({
      ...prev,
      staff: prev.staff.filter(staff => staff.id !== id)
    }));
  };

  const toggleAmenity = (amenity) => {
    setSalonData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const toggleSpecialization = (spec) => {
    setNewStaff(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec]
    }));
  };

  const toggleWorkingDay = (day) => {
    setNewStaff(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day]
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Salon profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Store },
    { id: 'photos', label: 'Photos', icon: Camera },
    { id: 'hours', label: 'Operating Hours', icon: Clock },
    { id: 'services', label: 'Services', icon: Scissors },
    { id: 'staff', label: 'Staff', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <SalonOwnerHeader />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Salon Profile</h1>
            <p className="text-gray-600 mt-1">Manage your salon information and settings</p>
          </div>
          
          <GlassButton 
            onClick={handleSave}
            disabled={loading}
            className="mt-4 md:mt-0"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </GlassButton>
        </div>

        {/* Status Card */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                userData?.verificationStatus === 'verified' 
                  ? 'bg-green-100' 
                  : userData?.verificationStatus === 'pending'
                  ? 'bg-yellow-100'
                  : 'bg-red-100'
              }`}>
                <Store className={`w-6 h-6 ${
                  userData?.verificationStatus === 'verified' 
                    ? 'text-green-600' 
                    : userData?.verificationStatus === 'pending'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Profile Status</h3>
                <p className={`text-sm ${
                  userData?.verificationStatus === 'verified' 
                    ? 'text-green-600' 
                    : userData?.verificationStatus === 'pending'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}>
                  {userData?.verificationStatus === 'verified' 
                    ? 'Verified and Active' 
                    : userData?.verificationStatus === 'pending'
                    ? 'Verification Pending'
                    : 'Setup Required'
                  }
                </p>
              </div>
            </div>
            
            {userData?.verificationStatus === 'pending' && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Complete your profile to get verified</p>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Tabs */}
        <GlassCard>
          <div className="border-b border-white/20">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap
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
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salon Name *
                    </label>
                    <GlassInput
                      value={salonData.basic.name}
                      onChange={(e) => handleInputChange('basic', 'name', e.target.value)}
                      placeholder="Enter salon name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={salonData.basic.category}
                      onChange={(e) => handleInputChange('basic', 'category', e.target.value)}
                      className="w-full bg-white/20 backdrop-blur-lg border border-white/20 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={salonData.basic.description}
                      onChange={(e) => handleInputChange('basic', 'description', e.target.value)}
                      placeholder="Describe your salon and services..."
                      rows={4}
                      className="w-full bg-white/20 backdrop-blur-lg border border-white/20 rounded-lg px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <GlassInput
                      value={salonData.basic.phone}
                      onChange={(e) => handleInputChange('basic', 'phone', e.target.value)}
                      placeholder="+91 9876543210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <GlassInput
                      value={salonData.basic.email}
                      onChange={(e) => handleInputChange('basic', 'email', e.target.value)}
                      placeholder="salon@example.com"
                      type="email"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website (Optional)
                    </label>
                    <GlassInput
                      value={salonData.basic.website}
                      onChange={(e) => handleInputChange('basic', 'website', e.target.value)}
                      placeholder="https://www.yoursalon.com"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <GlassInput
                        value={salonData.address.street}
                        onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Area/Locality *
                      </label>
                      <GlassInput
                        value={salonData.address.area}
                        onChange={(e) => handleInputChange('address', 'area', e.target.value)}
                        placeholder="Bandra West"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <GlassInput
                        value={salonData.address.city}
                        onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                        placeholder="Mumbai"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <GlassInput
                        value={salonData.address.state}
                        onChange={(e) => handleInputChange('address', 'state', e.target.value)}
                        placeholder="Maharashtra"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PIN Code *
                      </label>
                      <GlassInput
                        value={salonData.address.pincode}
                        onChange={(e) => handleInputChange('address', 'pincode', e.target.value)}
                        placeholder="400050"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nearby Landmarks
                      </label>
                      <GlassInput
                        value={salonData.address.landmarks}
                        onChange={(e) => handleInputChange('address', 'landmarks', e.target.value)}
                        placeholder="Near Linking Road Metro Station"
                      />
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">Amenities</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {amenitiesList.map((amenity) => (
                      <label
                        key={amenity}
                        className={`
                          flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-all
                          ${salonData.amenities.includes(amenity)
                            ? 'bg-purple-100/50 text-purple-800 border border-purple-300'
                            : 'bg-white/20 text-gray-700 border border-white/20 hover:bg-white/30'
                          }
                        `}
                      >
                        <input
                          type="checkbox"
                          checked={salonData.amenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                          className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm capitalize">{amenity.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Photos Tab */}
            {activeTab === 'photos' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Salon Photos</h3>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <GlassButton className="flex items-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span>Upload Photos</span>
                    </GlassButton>
                  </label>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {salonData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Salon photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {salonData.images.length === 0 && (
                    <div className="col-span-full">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Add Salon Photos</h3>
                        <p className="text-gray-600 mb-4">Upload high-quality images of your salon interior, exterior, and services</p>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <GlassButton>
                            <Upload className="w-4 h-4 mr-2" />
                            Choose Photos
                          </GlassButton>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50/50 border border-blue-200/50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Photo Guidelines</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Upload at least 5 high-quality photos</li>
                    <li>• Include exterior, interior, and service areas</li>
                    <li>• Ensure good lighting and clear visibility</li>
                    <li>• Maximum file size: 5MB per image</li>
                    <li>• Supported formats: JPG, PNG, WebP</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Operating Hours Tab */}
            {activeTab === 'hours' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Operating Hours</h3>
                
                <div className="space-y-4">
                  {weekDays.map((day) => (
                    <div key={day} className="flex items-center space-x-4 p-4 bg-white/20 rounded-lg">
                      <div className="w-24">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={salonData.operatingHours[day].isOpen}
                            onChange={(e) => handleOperatingHoursChange(day, 'isOpen', e.target.checked)}
                            className="rounded text-purple-600 focus:ring-purple-500"
                          />
                          <span className="font-medium text-gray-800 capitalize">{day}</span>
                        </label>
                      </div>
                      
                      {salonData.operatingHours[day].isOpen ? (
                        <div className="flex items-center space-x-2 flex-1">
                          <input
                            type="time"
                            value={salonData.operatingHours[day].open}
                            onChange={(e) => handleOperatingHoursChange(day, 'open', e.target.value)}
                            className="bg-white/20 backdrop-blur-lg border border-white/20 rounded px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          />
                          <span className="text-gray-600">to</span>
                          <input
                            type="time"
                            value={salonData.operatingHours[day].close}
                            onChange={(e) => handleOperatingHoursChange(day, 'close', e.target.value)}
                            className="bg-white/20 backdrop-blur-lg border border-white/20 rounded px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          />
                        </div>
                      ) : (
                        <div className="flex-1">
                          <span className="text-gray-500 italic">Closed</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Services & Pricing</h3>
                </div>

                {/* Add New Service */}
                <GlassCard className="p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Add New Service</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Name *
                      </label>
                      <GlassInput
                        value={newService.name}
                        onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Premium Haircut"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={newService.category}
                        onChange={(e) => setNewService(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-white/20 backdrop-blur-lg border border-white/20 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      >
                        {serviceCategories.map(cat => (
                          <option key={cat} value={cat}>{cat.replace('_', ' ').toUpperCase()}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={newService.description}
                        onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of the service..."
                        rows={2}
                        className="w-full bg-white/20 backdrop-blur-lg border border-white/20 rounded-lg px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (minutes) *
                      </label>
                      <GlassInput
                        type="number"
                        value={newService.duration}
                        onChange={(e) => setNewService(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                        placeholder="30"
                        min="5"
                        max="300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (₹) *
                      </label>
                      <GlassInput
                        type="number"
                        value={newService.price}
                        onChange={(e) => setNewService(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discounted Price (₹)
                      </label>
                      <GlassInput
                        type="number"
                        value={newService.discountedPrice}
                        onChange={(e) => setNewService(prev => ({ ...prev, discountedPrice: e.target.value }))}
                        placeholder="450"
                      />
                    </div>

                    <div className="flex justify-end">
                      <GlassButton onClick={addService}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Service
                      </GlassButton>
                    </div>
                  </div>
                </GlassCard>

                {/* Services List */}
                <div className="space-y-3">
                  {salonData.services.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 bg-white/20 rounded-lg">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-800">{service.name}</h5>
                        <p className="text-sm text-gray-600">{service.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{service.duration} mins</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-medium">
                              ₹{service.discountedPrice || service.price}
                              {service.discountedPrice && (
                                <span className="line-through text-gray-500 ml-1">₹{service.price}</span>
                              )}
                            </span>
                          </span>
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                            {service.category.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeService(service.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {salonData.services.length === 0 && (
                    <div className="text-center py-12">
                      <Scissors className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-800 mb-2">No services added yet</h3>
                      <p className="text-gray-600">Add your salon services and pricing to get started</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Staff Tab */}
            {activeTab === 'staff' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Staff Management</h3>
                </div>

                {/* Add New Staff */}
                <GlassCard className="p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Add Staff Member</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <GlassInput
                        value={newStaff.name}
                        onChange={(e) => setNewStaff(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Priya Sharma"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Designation *
                      </label>
                      <GlassInput
                        value={newStaff.designation}
                        onChange={(e) => setNewStaff(prev => ({ ...prev, designation: e.target.value }))}
                        placeholder="e.g., Senior Hair Stylist"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience (years)
                      </label>
                      <GlassInput
                        type="number"
                        value={newStaff.experience}
                        onChange={(e) => setNewStaff(prev => ({ ...prev, experience: e.target.value }))}
                        placeholder="5"
                        min="0"
                        max="50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specializations
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {specializations.map((spec) => (
                          <label
                            key={spec}
                            className={`
                              flex items-center space-x-2 p-2 rounded cursor-pointer transition-all text-sm
                              ${newStaff.specializations.includes(spec)
                                ? 'bg-purple-100/50 text-purple-800 border border-purple-300'
                                : 'bg-white/20 text-gray-700 border border-white/20 hover:bg-white/30'
                              }
                            `}
                          >
                            <input
                              type="checkbox"
                              checked={newStaff.specializations.includes(spec)}
                              onChange={() => toggleSpecialization(spec)}
                              className="rounded text-purple-600 focus:ring-purple-500"
                            />
                            <span>{spec}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Working Days
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {weekDays.map((day) => (
                          <label
                            key={day}
                            className={`
                              flex items-center space-x-2 p-2 rounded cursor-pointer transition-all text-sm
                              ${newStaff.workingDays.includes(day)
                                ? 'bg-purple-100/50 text-purple-800 border border-purple-300'
                                : 'bg-white/20 text-gray-700 border border-white/20 hover:bg-white/30'
                              }
                            `}
                          >
                            <input
                              type="checkbox"
                              checked={newStaff.workingDays.includes(day)}
                              onChange={() => toggleWorkingDay(day)}
                              className="rounded text-purple-600 focus:ring-purple-500"
                            />
                            <span className="capitalize">{day.slice(0, 3)}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-2 flex justify-end">
                      <GlassButton onClick={addStaff}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Staff Member
                      </GlassButton>
                    </div>
                  </div>
                </GlassCard>

                {/* Staff List */}
                <div className="space-y-4">
                  {salonData.staff.map((staff) => (
                    <div key={staff.id} className="flex items-center justify-between p-4 bg-white/20 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-800">{staff.name}</h5>
                          <p className="text-sm text-gray-600">{staff.designation}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            {staff.experience && (
                              <span className="text-sm text-gray-600">{staff.experience} years exp.</span>
                            )}
                            <div className="flex flex-wrap gap-1">
                              {staff.specializations.slice(0, 2).map((spec) => (
                                <span key={spec} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                                  {spec}
                                </span>
                              ))}
                              {staff.specializations.length > 2 && (
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                  +{staff.specializations.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeStaff(staff.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {salonData.staff.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-800 mb-2">No staff members added yet</h3>
                      <p className="text-gray-600">Add your team members to manage owner-appointments</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default SalonProfilePage;
