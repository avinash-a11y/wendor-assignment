import React, { useState, useEffect, useMemo } from 'react';
import { useApi } from '../hooks/useApi';
import { useNotificationContext } from './NotificationProvider';
import { ServiceProviderCard } from './ServiceProviderCard';
import { SlotSelector } from './SlotSelector';
import { ServiceTypeFilter } from './ServiceTypeFilter';
import { DateSelector } from './DateSelector';
import { LoadingSpinner } from './LoadingSpinner';
import { apiService } from '../services/api';
import { ServiceProvider, Slot, ServiceType, User } from '../types';
import { formatDate, getDateRange } from '../utils';

export function BookingPage() {
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | ''>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedServiceProvider, setSelectedServiceProvider] = useState<ServiceProvider | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const { showSuccess, showError } = useNotificationContext();

  // API hooks
  const {
    data: serviceTypes,
    loading: loadingServiceTypes,
    execute: fetchServiceTypes,
  } = useApi(apiService.getServiceTypes);


  const {
    data: serviceProviders,
    loading: loadingServiceProviders,
    execute: fetchServiceProviders,
  } = useApi(apiService.getServiceProviders);

  const {
    data: availableSlots,
    loading: loadingSlots,
    execute: fetchAvailableSlots,
  } = useApi(apiService.getAvailableSlots);

  const {
    execute: bookSlot,
  } = useApi(apiService.bookSlot);


  // Fetch service types on mount
  useEffect(() => {
    fetchServiceTypes();
  }, [fetchServiceTypes]);

  // Fetch service providers when service type changes
  useEffect(() => {
    if (selectedServiceType) {
      fetchServiceProviders({ serviceType: selectedServiceType });
    }
  }, [selectedServiceType, fetchServiceProviders]); // Add fetchServiceProviders back

  // Fetch available slots when service provider and date change
  useEffect(() => {
    if (selectedServiceProvider && selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      fetchAvailableSlots(selectedServiceProvider._id, dateString);
    }
  }, [selectedServiceProvider, selectedDate, fetchAvailableSlots]); // Add fetchAvailableSlots back


  // Available dates (next 7 days)
  const availableDates = useMemo(() => getDateRange(7), []);

  // Handle slot booking
  const handleBookSlot = async () => {
    if (!selectedSlot || !selectedServiceProvider) {
      showError('Please select a slot to book');
      return;
    }

    setIsBooking(true);
    try {
      // For demo purposes, using a mock customer ID
      const customerId = '507f1f77bcf86cd799439011';
      
      const booking = await bookSlot({
        slotId: selectedSlot._id,
        customerId,
        notes: `Booking for ${selectedServiceProvider.serviceType} service`,
      });

      if (booking) {
        showSuccess('Slot booked successfully! Redirecting to review page...');
        // Redirect to review page
        setTimeout(() => {
          window.location.href = `/review/${booking._id}`;
        }, 2000);
      }
    } catch (error) {
      showError('Failed to book slot. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  // Reset selections when service type changes
  const handleServiceTypeChange = (serviceType: string) => {
    setSelectedServiceType(serviceType as ServiceType | '');
    setSelectedServiceProvider(null);
    setSelectedSlot(null);
  };

  // Reset slot selection when service provider changes
  const handleServiceProviderSelect = (serviceProvider: ServiceProvider) => {
    setSelectedServiceProvider(serviceProvider);
    setSelectedSlot(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🏠 Book Your Home Service
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            <strong>Simple as 1-2-3!</strong> Choose what you need, pick your expert, and book your time. 
            <br />No hassle, no confusion - just great service at your doorstep! ✨
          </p>
        </div>



        {/* Step-by-Step Process */}
        <div className="max-w-6xl mx-auto">
          {/* Step 1: Choose Service Type */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full text-2xl font-bold mb-4">
                1
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                What do you need help with? 🤔
              </h2>
              <p className="text-lg text-gray-600">
                Click on the service you need - it's that simple!
              </p>
            </div>
            
            {loadingServiceTypes ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {serviceTypes?.map((serviceType) => (
                  <button
                    key={serviceType.value}
                    onClick={() => handleServiceTypeChange(serviceType.value)}
                    className={`group relative p-8 rounded-2xl border-4 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                      selectedServiceType === serviceType.value
                        ? 'border-green-500 bg-green-50 shadow-2xl scale-105'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {serviceType.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {serviceType.label}
                      </h3>
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                        selectedServiceType === serviceType.value
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        {selectedServiceType === serviceType.value ? '✓' : ''}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Step 2: Choose Service Provider */}
          {selectedServiceType && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full text-2xl font-bold mb-4">
                  2
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Choose Your Expert! 👨‍🔧
                </h2>
                <p className="text-lg text-gray-600">
                  Pick the professional you trust - all our experts are verified and experienced!
                </p>
              </div>
              
              {loadingServiceProviders ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {serviceProviders?.map((provider : ServiceProvider) => (
                    <div
                      key={provider._id}
                      onClick={() => handleServiceProviderSelect(provider)}
                      className={`group relative p-6 rounded-2xl border-4 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer ${
                        selectedServiceProvider?._id === provider._id
                          ? 'border-blue-500 bg-blue-50 shadow-2xl scale-105'
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                          {provider.user?.name?.charAt(0) || 'P'}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {provider.user?.name || 'Professional'}
                          </h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex text-yellow-400">
                              {'★'.repeat(Math.floor(provider.rating || 0))}
                            </div>
                            <span className="text-gray-600 font-semibold">
                              {provider.rating?.toFixed(1) || '5.0'} ({provider.totalBookings || 0} jobs)
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">
                            {provider.experience || 0} years experience
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-green-600">
                              ₹{provider.hourlyRate || 0}/hour
                            </span>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              selectedServiceProvider?._id === provider._id
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-400'
                            }`}>
                              {selectedServiceProvider?._id === provider._id ? '✓' : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {serviceProviders?.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">😔</div>
                  <p className="text-xl text-gray-500">
                    No experts available for this service right now.
                  </p>
                  <p className="text-gray-400 mt-2">
                    Please try again later or contact us directly!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Choose Date & Time */}
          {selectedServiceProvider && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500 text-white rounded-full text-2xl font-bold mb-4">
                  3
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Pick Your Perfect Time! 📅
                </h2>
                <p className="text-lg text-gray-600">
                  Choose when you want your expert to visit - we'll make it happen!
                </p>
              </div>
              
              {/* Date Selector */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  📅 Which day works for you?
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {availableDates.map((date) => (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={`p-4 rounded-xl border-4 transition-all duration-300 transform hover:scale-105 ${
                        selectedDate.toDateString() === date.toDateString()
                          ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                          : 'border-gray-200 bg-white hover:border-purple-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">
                          {date.getDate()}
                        </div>
                        <div className="text-sm font-semibold text-gray-700">
                          {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {date.toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slot Selector */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  ⏰ What time works best?
                </h3>
                {loadingSlots ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {availableSlots?.map((slot) => (
                      <button
                        key={slot._id}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-4 rounded-xl border-4 transition-all duration-300 transform hover:scale-105 ${
                          selectedSlot?._id === slot._id
                            ? 'border-green-500 bg-green-50 shadow-lg scale-105'
                            : 'border-gray-200 bg-white hover:border-green-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-xl font-bold text-gray-900 mb-1">
                            {slot.startTime}
                          </div>
                          <div className="text-sm text-gray-600">
                            {slot.duration} min
                          </div>
                          <div className="text-lg font-bold text-green-600 mt-2">
                            ₹{slot.price}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {availableSlots?.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">😔</div>
                    <p className="text-xl text-gray-500">
                      No time slots available for this date.
                    </p>
                    <p className="text-gray-400 mt-2">
                      Please try selecting a different date!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Booking Summary
              </h2>
              
              {selectedServiceProvider && selectedSlot ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Service</h3>
                    <p className="text-gray-600 capitalize">
                      {selectedServiceProvider.serviceType.replace('_', ' ')}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900">Provider</h3>
                    <p className="text-gray-600">{selectedServiceProvider.user?.name}</p>
                    <p className="text-sm text-gray-500">
                      ⭐ {selectedServiceProvider.rating} • {selectedServiceProvider.totalBookings} bookings
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900">Date & Time</h3>
                    <p className="text-gray-600">
                      {formatDate(selectedSlot.date)} at {selectedSlot.startTime}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900">Duration</h3>
                    <p className="text-gray-600">{selectedSlot.duration} minutes</p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Total Amount</span>
                      <span className="text-lg font-semibold text-primary-600">
                        ₹{selectedSlot.price}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleBookSlot}
                    disabled={isBooking}
                    className="w-full btn btn-primary btn-lg mt-6"
                  >
                    {isBooking ? (
                      <div className="flex items-center justify-center">
                        <div className="loading-spinner mr-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </div>
                        Booking...
                      </div>
                    ) : (
                      'Book Now'
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">
                    Select a service provider and time slot to see booking details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
