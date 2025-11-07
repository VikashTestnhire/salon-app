'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  EyeIcon,
  TrashIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function SalonManagement() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSalons();
  }, []);

  const fetchSalons = async () => {
    try {
      const salonsSnapshot = await getDocs(collection(db, 'salons'));
      const salonsData = salonsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSalons(salonsData);
    } catch (error) {
      console.error('Error fetching salons:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSalonStatus = async (salonId, status) => {
    try {
      await updateDoc(doc(db, 'salons', salonId), {
        approvalStatus: status,
        updatedAt: new Date().toISOString()
      });
      
      // Update local state
      setSalons(prev => prev.map(salon => 
        salon.id === salonId 
          ? { ...salon, approvalStatus: status }
          : salon
      ));
    } catch (error) {
      console.error('Error updating salon status:', error);
    }
  };

  const deleteSalon = async (salonId) => {
    if (confirm('Are you sure you want to delete this salon? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'salons', salonId));
        setSalons(prev => prev.filter(salon => salon.id !== salonId));
      } catch (error) {
        console.error('Error deleting salon:', error);
      }
    }
  };

  const filteredSalons = salons.filter(salon => {
    if (filter === 'all') return true;
    return salon.approvalStatus === filter;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Salon Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Approve, reject, and manage salon registrations on the platform.
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'all', label: 'All Salons', count: salons.length },
              { key: 'pending', label: 'Pending', count: salons.filter(s => s.approvalStatus === 'pending').length },
              { key: 'approved', label: 'Approved', count: salons.filter(s => s.approvalStatus === 'approved').length },
              { key: 'rejected', label: 'Rejected', count: salons.filter(s => s.approvalStatus === 'rejected').length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filter === tab.key
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Salons list */}
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredSalons.map((salon) => (
            <li key={salon.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Image
                        className="h-16 w-16 rounded-lg object-cover"
                        src={salon.images?.[0] || '/placeholder-salon.jpg'}
                        alt={salon.name}
                        width={64}
                        height={64}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">{salon.name}</h3>
                        <div className="ml-2">
                          {getStatusBadge(salon.approvalStatus)}
                        </div>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {salon.address?.street}, {salon.address?.city}
                      </div>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <PhoneIcon className="h-4 w-4 mr-1" />
                          {salon.contact?.phone}
                        </div>
                        <div className="flex items-center">
                          <EnvelopeIcon className="h-4 w-4 mr-1" />
                          {salon.contact?.email}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedSalon(salon);
                        setShowModal(true);
                      }}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View
                    </button>
                    
                    {salon.approvalStatus === 'pending' && (
                      <>
                        <button
                          onClick={() => updateSalonStatus(salon.id, 'approved')}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => updateSalonStatus(salon.id, 'rejected')}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                          <XCircleIcon className="h-4 w-4 mr-1" />
                          Reject
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => deleteSalon(salon.id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Services: {salon.services?.length || 0} available
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Registered: {salon.createdAt ? new Date(salon.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Salon Details Modal */}
      {showModal && selectedSalon && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Salon Details: {selectedSalon.name}
                      </h3>
                      <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <XCircleIcon className="h-6 w-6" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Name</dt>
                            <dd className="text-sm text-gray-900">{selectedSalon.name}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Description</dt>
                            <dd className="text-sm text-gray-900">{selectedSalon.description}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                            <dd className="text-sm text-gray-900">{getStatusBadge(selectedSalon.approvalStatus)}</dd>
                          </div>
                        </dl>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Phone</dt>
                            <dd className="text-sm text-gray-900">{selectedSalon.contact?.phone}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                            <dd className="text-sm text-gray-900">{selectedSalon.contact?.email}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Address</dt>
                            <dd className="text-sm text-gray-900">
                              {selectedSalon.address?.street}, {selectedSalon.address?.city}, {selectedSalon.address?.state} {selectedSalon.address?.pincode}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                    
                    {selectedSalon.services && selectedSalon.services.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium text-gray-900 mb-2">Services ({selectedSalon.services.length})</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {selectedSalon.services.map((service, index) => (
                            <div key={index} className="border rounded-lg p-3">
                              <h5 className="font-medium text-gray-900">{service.name}</h5>
                              <p className="text-sm text-gray-600">{service.description}</p>
                              <div className="mt-1 flex justify-between">
                                <span className="text-sm font-medium text-green-600">₹{service.price}</span>
                                <span className="text-sm text-gray-500">{service.duration} mins</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedSalon.approvalStatus === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        updateSalonStatus(selectedSalon.id, 'approved');
                        setShowModal(false);
                      }}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Approve Salon
                    </button>
                    <button
                      onClick={() => {
                        updateSalonStatus(selectedSalon.id, 'rejected');
                        setShowModal(false);
                      }}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Reject Salon
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
