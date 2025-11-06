'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { 
  UserIcon, 
  BuildingStorefrontIcon,
  ShieldCheckIcon,
  EyeIcon,
  TrashIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [salonOwners, setSalonOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, users, salon_owners, admins
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch regular users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        userType: 'user'
      }));

      // Fetch salon owners
      const salonOwnersSnapshot = await getDocs(collection(db, 'salonOwners'));
      const salonOwnersData = salonOwnersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        userType: 'salon_owner'
      }));

      setUsers(usersData);
      setSalonOwners(salonOwnersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, userType, currentStatus) => {
    try {
      const collection = userType === 'salon_owner' ? 'salonOwners' : 'users';
      await updateDoc(doc(db, collection, userId), {
        isActive: !currentStatus,
        updatedAt: new Date().toISOString()
      });
      
      // Update local state
      if (userType === 'salon_owner') {
        setSalonOwners(prev => prev.map(user => 
          user.id === userId 
            ? { ...user, isActive: !currentStatus }
            : user
        ));
      } else {
        setUsers(prev => prev.map(user => 
          user.id === userId 
            ? { ...user, isActive: !currentStatus }
            : user
        ));
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const deleteUser = async (userId, userType) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const collection = userType === 'salon_owner' ? 'salonOwners' : 'users';
        await deleteDoc(doc(db, collection, userId));
        
        if (userType === 'salon_owner') {
          setSalonOwners(prev => prev.filter(user => user.id !== userId));
        } else {
          setUsers(prev => prev.filter(user => user.id !== userId));
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const allUsers = [...users, ...salonOwners];
  const filteredUsers = allUsers.filter(user => {
    if (filter === 'all') return true;
    if (filter === 'users') return user.role === 'user';
    if (filter === 'salon_owners') return user.role === 'salon_owner';
    if (filter === 'admins') return user.role === 'admin';
    return true;
  });

  const getRoleBadge = (role) => {
    const styles = {
      user: 'bg-blue-100 text-blue-800',
      salon_owner: 'bg-purple-100 text-purple-800',
      admin: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      user: 'User',
      salon_owner: 'Salon Owner',
      admin: 'Admin'
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styles[role]}`}>
        {labels[role]}
      </span>
    );
  };

  const getStatusBadge = (isActive) => {
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {isActive ? 'Active' : 'Inactive'}
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
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage all users, salon owners, and administrators on the platform.
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'all', label: 'All Users', count: allUsers.length },
              { key: 'users', label: 'Customers', count: users.length },
              { key: 'salon_owners', label: 'Salon Owners', count: salonOwners.length },
              { key: 'admins', label: 'Admins', count: allUsers.filter(u => u.role === 'admin').length }
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

      {/* Users list */}
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <li key={user.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        {user.role === 'salon_owner' ? (
                          <BuildingStorefrontIcon className="h-6 w-6 text-gray-600" />
                        ) : user.role === 'admin' ? (
                          <ShieldCheckIcon className="h-6 w-6 text-gray-600" />
                        ) : (
                          <UserIcon className="h-6 w-6 text-gray-600" />
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {user.profile?.firstName} {user.profile?.lastName}
                        </h3>
                        {getRoleBadge(user.role)}
                        {getStatusBadge(user.isActive)}
                      </div>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <EnvelopeIcon className="h-4 w-4 mr-1" />
                          {user.email}
                        </div>
                        {user.profile?.phone && (
                          <div className="flex items-center">
                            <PhoneIcon className="h-4 w-4 mr-1" />
                            {user.profile.phone}
                          </div>
                        )}
                      </div>
                      {user.role === 'salon_owner' && (
                        <div className="mt-1 text-sm text-gray-500">
                          Business: {user.businessInfo?.businessName || 'Not provided'}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowModal(true);
                      }}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View
                    </button>
                    
                    <button
                      onClick={() => toggleUserStatus(user.id, user.userType, user.isActive)}
                      className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white ${
                        user.isActive 
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    
                    <button
                      onClick={() => deleteUser(user.id, user.userType)}
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
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  {user.role === 'user' && user.bookingHistory && (
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        {user.bookingHistory.totalBookings || 0} bookings • ₹{user.bookingHistory.totalSpent || 0} spent
                      </p>
                    </div>
                  )}
                  {user.role === 'salon_owner' && user.earnings && (
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Earnings: ₹{user.earnings.totalEarnings || 0}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        User Details: {selectedUser.profile?.firstName} {selectedUser.profile?.lastName}
                      </h3>
                      <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Name</dt>
                            <dd className="text-sm text-gray-900">
                              {selectedUser.profile?.firstName} {selectedUser.profile?.lastName}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                            <dd className="text-sm text-gray-900">{selectedUser.email}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Phone</dt>
                            <dd className="text-sm text-gray-900">{selectedUser.profile?.phone || 'Not provided'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Role</dt>
                            <dd className="text-sm text-gray-900">{getRoleBadge(selectedUser.role)}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                            <dd className="text-sm text-gray-900">{getStatusBadge(selectedUser.isActive)}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                            <dd className="text-sm text-gray-900">
                              {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                            </dd>
                          </div>
                        </dl>
                      </div>
                      
                      <div>
                        {selectedUser.role === 'user' && selectedUser.wallet && (
                          <>
                            <h4 className="font-medium text-gray-900 mb-2">Wallet & Activity</h4>
                            <dl className="space-y-2">
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Wallet Balance</dt>
                                <dd className="text-sm text-gray-900">₹{selectedUser.wallet.balance || 0}</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Total Bookings</dt>
                                <dd className="text-sm text-gray-900">{selectedUser.bookingHistory?.totalBookings || 0}</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Total Spent</dt>
                                <dd className="text-sm text-gray-900">₹{selectedUser.bookingHistory?.totalSpent || 0}</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Loyalty Points</dt>
                                <dd className="text-sm text-gray-900">{selectedUser.loyaltyPoints || 0}</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Membership Tier</dt>
                                <dd className="text-sm text-gray-900">{selectedUser.membershipTier || 'Bronze'}</dd>
                              </div>
                            </dl>
                          </>
                        )}
                        
                        {selectedUser.role === 'salon_owner' && (
                          <>
                            <h4 className="font-medium text-gray-900 mb-2">Business Information</h4>
                            <dl className="space-y-2">
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Business Name</dt>
                                <dd className="text-sm text-gray-900">{selectedUser.businessInfo?.businessName || 'Not provided'}</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Total Earnings</dt>
                                <dd className="text-sm text-gray-900">₹{selectedUser.earnings?.totalEarnings || 0}</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Pending Payouts</dt>
                                <dd className="text-sm text-gray-900">₹{selectedUser.earnings?.pendingPayouts || 0}</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Commission Rate</dt>
                                <dd className="text-sm text-gray-900">{(selectedUser.earnings?.commissionRate * 100) || 15}%</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Verification Status</dt>
                                <dd className="text-sm text-gray-900">{selectedUser.verificationStatus || 'Pending'}</dd>
                              </div>
                            </dl>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => toggleUserStatus(selectedUser.id, selectedUser.userType, selectedUser.isActive)}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${
                    selectedUser.isActive 
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {selectedUser.isActive ? 'Deactivate User' : 'Activate User'}
                </button>
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
