import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useNotificationContext } from './NotificationProvider';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';
import { StepProgress } from './StepProgress';
import { apiService } from '../services/api';
import { ServiceProvider, Slot, ServiceType } from '../types';
import { formatDate, getDateRange } from '../utils';

const BOOKING_STEPS = [
  { id: 1, title: 'Service', description: 'Choose service type', icon: '🔧' },
  { id: 2, title: 'Provider', description: 'Select provider', icon: '👨‍🔧' },
  { id: 3, title: 'Schedule', description: 'Pick date & time', icon: '📅' },
  { id: 4, title: 'Details', description: 'Your information', icon: '📝' },
  { id: 5, title: 'Confirm', description: 'Review & book', icon: '✅' }
];

export function BookingPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | ''>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedServiceProvider, setSelectedServiceProvider] = useState<ServiceProvider | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const { showSuccess, showError } = useNotificationContext();

  // API hooks - must be called at the top level
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

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      showError('Please login to book services');
      navigate('/login');
    }
  }, [isAuthenticated, navigate, showError]);

  // Fetch service types on mount
  useEffect(() => {
    fetchServiceTypes();
  }, [fetchServiceTypes]);

  // Fetch service providers when service type changes
  useEffect(() => {
    if (selectedServiceType) {
      fetchServiceProviders({ serviceType: selectedServiceType });
    }
  }, [selectedServiceType, fetchServiceProviders]);

  // Fetch available slots when service provider or date changes
  useEffect(() => {
    if (selectedServiceProvider && selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      fetchAvailableSlots(selectedServiceProvider._id, dateStr);
    }
  }, [selectedServiceProvider, selectedDate, fetchAvailableSlots]);

  // Show loading while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" text="Checking authentication..." />
      </div>
    );
  }

  const handleServiceTypeSelect = (serviceType: ServiceType) => {
    setSelectedServiceType(serviceType);
    setSelectedServiceProvider(null);
    setSelectedSlot(null);
    setCurrentStep(2);
  };

  const handleServiceProviderSelect = (provider: ServiceProvider) => {
    setSelectedServiceProvider(provider);
    setSelectedSlot(null);
    setCurrentStep(3);
  };

  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlot(slot);
    setCurrentStep(4);
  };


  const handleBookingConfirm = async () => {
    if (!selectedSlot) return;

    setIsBooking(true);
    try {
      // Use logged-in user details instead of hardcoded values
      const result = await bookSlot({
        slotId: selectedSlot._id,
        customerId: user?._id // Use the logged-in user's ID
      });

      if (result?._id) {
        showSuccess('Booking confirmed successfully!');
        navigate(`/review/${result._id}`);
      }
    } catch (error) {
      showError('Failed to confirm booking. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const goBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      
      if (currentStep === 2) {
        setSelectedServiceType('');
        setSelectedServiceProvider(null);
        setSelectedSlot(null);
      } else if (currentStep === 3) {
        setSelectedServiceProvider(null);
        setSelectedSlot(null);
      } else if (currentStep === 4) {
        setSelectedSlot(null);
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderServiceTypeSelection();
      case 2:
        return renderServiceProviderSelection();
      case 3:
        return renderDateTimeSelection();
      case 4:
        return renderCustomerDetails();
      case 5:
        return renderBookingConfirmation();
      default:
        return null;
    }
  };

  const renderServiceTypeSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Service</h2>
        <p className="text-gray-600">Select the type of service you need</p>
      </div>

      {loadingServiceTypes ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {serviceTypes?.map((serviceType) => (
            <button
              key={serviceType.value}
              onClick={() => handleServiceTypeSelect(serviceType.value)}
              className="group p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200 text-center"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
                {serviceType.icon}
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                {serviceType.label}
              </h3>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderServiceProviderSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Provider</h2>
        <p className="text-gray-600">Select from our trusted professionals</p>
      </div>

      {loadingServiceProviders ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" text="Loading providers..." />
        </div>
      ) : serviceProviders && serviceProviders.length > 0 ? (
        <div className="grid gap-4 max-w-3xl mx-auto">
          {serviceProviders?.map((provider) => (
            <button
              key={provider._id}
              onClick={() => handleServiceProviderSelect(provider)}
              className="group p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200 text-left"
            >
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-blue-600">
                    {typeof provider.userId === 'object' ? provider.userId.name.charAt(0) : 'P'}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600">
                    {typeof provider.userId === 'object' ? provider.userId.name : 'Provider'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {provider.serviceType ? provider.serviceType.charAt(0).toUpperCase() + provider.serviceType.slice(1) : 'Professional Service'}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>⭐ {provider.rating || 4.5} rating</span>
                    <span>📍 {provider.location?.area || provider.location?.city || 'Local area'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">₹{provider.hourlyRate || 500}</div>
                  <div className="text-sm text-gray-500">Per hour</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Providers Available</h3>
          <p className="text-gray-600 mb-4">
            {selectedServiceType 
              ? `No providers found for ${selectedServiceType} service.` 
              : 'Please select a service type first.'}
          </p>
          <button
            onClick={() => {
              setCurrentStep(1);
              setSelectedServiceType('');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Choose Different Service
          </button>
        </div>
      )}
    </div>
  );

  const renderDateTimeSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pick Date & Time</h2>
        <p className="text-gray-600">Choose when you'd like the service</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Date Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Select Date</h3>
          <div className="grid grid-cols-7 gap-2">
            {getDateRange(7).map((date) => (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`p-3 rounded-lg text-center transition-all duration-200 ${
                  selectedDate.toDateString() === date.toDateString()
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border-2 border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="text-xs text-gray-500 mb-1">
                  {date.toLocaleDateString('en', { weekday: 'short' })}
                </div>
                <div className="font-semibold">
                  {date.getDate()}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Available Times</h3>
          {loadingSlots ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {availableSlots?.map((slot) => (
                <button
                  key={slot._id}
                  onClick={() => handleSlotSelect(slot)}
                  className={`p-3 rounded-lg text-center font-medium transition-all duration-200 ${
                    selectedSlot?._id === slot._id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border-2 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {slot.startTime}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderCustomerDetails = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Details</h2>
        <p className="text-gray-600">Review your information for the booking</p>
      </div>

      <div className="max-w-md mx-auto bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-blue-600">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">{user?.name}</h3>
          <p className="text-gray-600">{user?.email}</p>
          <p className="text-gray-600">{user?.phone}</p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-medium text-gray-700">Name:</span>
            <span className="text-gray-900">{user?.name}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-medium text-gray-700">Email:</span>
            <span className="text-gray-900">{user?.email}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-medium text-gray-700">Phone:</span>
            <span className="text-gray-900">{user?.phone}</span>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => setCurrentStep(5)}
            className="w-full btn btn-primary btn-lg"
          >
            Continue with These Details
          </button>
        </div>
      </div>
    </div>
  );

  const renderBookingConfirmation = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Your Booking</h2>
        <p className="text-gray-600">Review your details before confirming</p>
      </div>

      <div className="max-w-lg mx-auto bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex justify-between items-center pb-4 border-b">
          <span className="font-semibold text-gray-900">Service</span>
          <span className="capitalize">{selectedServiceType}</span>
        </div>
        
        <div className="flex justify-between items-center pb-4 border-b">
          <span className="font-semibold text-gray-900">Provider</span>
          <span>{typeof selectedServiceProvider?.userId === 'object' ? selectedServiceProvider.userId.name : 'Provider'}</span>
        </div>
        
        <div className="flex justify-between items-center pb-4 border-b">
          <span className="font-semibold text-gray-900">Date & Time</span>
          <span>{formatDate(selectedDate)} at {selectedSlot?.startTime}</span>
        </div>
        
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total</span>
          <span>₹{selectedServiceProvider?.hourlyRate || 500}</span>
        </div>

        <button
          onClick={handleBookingConfirm}
          disabled={isBooking}
          className="w-full btn btn-primary btn-lg mt-6"
        >
          {isBooking ? 'Confirming...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">

        {/* Progress Steps */}
        <StepProgress currentStep={currentStep} steps={BOOKING_STEPS} />

        {/* Back Button */}
        {currentStep > 1 && (
          <div className="mb-6">
            <button
              onClick={goBackStep}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-gray-50 rounded-2xl p-8">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
}
