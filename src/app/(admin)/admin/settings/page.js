'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { 
  CogIcon,
  CurrencyRupeeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    commission: {
      rate: 0.15, // 15%
      minimumPayout: 100,
      payoutCycle: 'weekly' // weekly, monthly
    },
    platform: {
      maintenanceMode: false,
      allowNewRegistrations: true,
      maxBookingsPerUser: 10
    }
  });
  
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);
  const [newPlan, setNewPlan] = useState({
    name: '',
    price: '',
    duration: 'monthly',
    features: [],
    isActive: true
  });
  const [showNewPlanForm, setShowNewPlanForm] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchSubscriptionPlans();
  }, []);

  const fetchSettings = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'platform'));
      if (settingsDoc.exists()) {
        setSettings(settingsDoc.data());
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptionPlans = async () => {
    try {
      const plansSnapshot = await getDocs(collection(db, 'subscriptionPlans'));
      const plansData = plansSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSubscriptionPlans(plansData);
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'platform'), settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const createSubscriptionPlan = async () => {
    try {
      await addDoc(collection(db, 'subscriptionPlans'), {
        ...newPlan,
        price: parseFloat(newPlan.price),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      setNewPlan({
        name: '',
        price: '',
        duration: 'monthly',
        features: [],
        isActive: true
      });
      setShowNewPlanForm(false);
      fetchSubscriptionPlans();
      alert('Subscription plan created successfully!');
    } catch (error) {
      console.error('Error creating subscription plan:', error);
      alert('Error creating subscription plan. Please try again.');
    }
  };

  const updateSubscriptionPlan = async (planId, updatedPlan) => {
    try {
      await updateDoc(doc(db, 'subscriptionPlans', planId), {
        ...updatedPlan,
        updatedAt: new Date().toISOString()
      });
      
      setEditingPlan(null);
      fetchSubscriptionPlans();
      alert('Subscription plan updated successfully!');
    } catch (error) {
      console.error('Error updating subscription plan:', error);
      alert('Error updating subscription plan. Please try again.');
    }
  };

  const addFeatureToNewPlan = () => {
    setNewPlan(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeatureInNewPlan = (index, value) => {
    setNewPlan(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const removeFeatureFromNewPlan = (index) => {
    setNewPlan(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
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
          <h1 className="text-2xl font-semibold text-gray-900">Platform Settings</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage platform configuration, commission rates, and subscription plans.
          </p>
        </div>
      </div>

      {/* Commission Settings */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <CurrencyRupeeIcon className="h-5 w-5 mr-2" />
            Commission Settings
          </h3>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Commission Rate (%)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={(settings.commission.rate * 100).toFixed(2)}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    commission: {
                      ...prev.commission,
                      rate: parseFloat(e.target.value) / 100
                    }
                  }))}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Platform commission rate for each booking
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Payout Amount (₹)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  min="0"
                  value={settings.commission.minimumPayout}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    commission: {
                      ...prev.commission,
                      minimumPayout: parseInt(e.target.value)
                    }
                  }))}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Minimum amount required for salon owner payouts
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payout Cycle
              </label>
              <div className="mt-1">
                <select
                  value={settings.commission.payoutCycle}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    commission: {
                      ...prev.commission,
                      payoutCycle: e.target.value
                    }
                  }))}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                How often to process salon owner payouts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Settings */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <CogIcon className="h-5 w-5 mr-2" />
            Platform Settings
          </h3>
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Maintenance Mode</h4>
                <p className="text-sm text-gray-500">Temporarily disable the platform for maintenance</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings(prev => ({
                  ...prev,
                  platform: {
                    ...prev.platform,
                    maintenanceMode: !prev.platform.maintenanceMode
                  }
                }))}
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  settings.platform.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'
                }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                  settings.platform.maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Allow New Registrations</h4>
                <p className="text-sm text-gray-500">Allow new users and salon owners to register</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings(prev => ({
                  ...prev,
                  platform: {
                    ...prev.platform,
                    allowNewRegistrations: !prev.platform.allowNewRegistrations
                  }
                }))}
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  settings.platform.allowNewRegistrations ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                  settings.platform.allowNewRegistrations ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Maximum Bookings Per User
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  min="1"
                  value={settings.platform.maxBookingsPerUser}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    platform: {
                      ...prev.platform,
                      maxBookingsPerUser: parseInt(e.target.value)
                    }
                  }))}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Maximum number of active bookings per user
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Save Settings Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Subscription Plans */}
      <div className="mt-12 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Subscription Plans
            </h3>
            <button
              onClick={() => setShowNewPlanForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Plan
            </button>
          </div>

          {/* New Plan Form */}
          {showNewPlanForm && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Create New Subscription Plan</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Plan Name</label>
                  <input
                    type="text"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="e.g., Premium Plan"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price (���)</label>
                  <input
                    type="number"
                    min="0"
                    value={newPlan.price}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, price: e.target.value }))}
                    className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="999"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration</label>
                  <select
                    value={newPlan.duration}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, duration: e.target.value }))}
                    className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                {newPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeatureInNewPlan(index, e.target.value)}
                      className="flex-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Enter feature"
                    />
                    <button
                      onClick={() => removeFeatureFromNewPlan(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addFeatureToNewPlan}
                  className="text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  + Add Feature
                </button>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowNewPlanForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={createSubscriptionPlan}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Create Plan
                </button>
              </div>
            </div>
          )}

          {/* Existing Plans */}
          <div className="mt-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {subscriptionPlans.map((plan) => (
                <div key={plan.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{plan.name}</h4>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setEditingPlan(plan)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mb-2">
                    <span className="text-2xl font-bold text-gray-900">₹{plan.price}</span>
                    <span className="text-gray-500">/{plan.duration}</span>
                  </div>
                  <ul className="space-y-1">
                    {plan.features?.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      plan.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {subscriptionPlans.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No subscription plans created yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
