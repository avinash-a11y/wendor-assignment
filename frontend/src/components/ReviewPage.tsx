import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useNotificationContext } from './NotificationProvider';
import { LoadingSpinner } from './LoadingSpinner';
import { apiService } from '../services/api';
import { Booking, ServiceProvider, User, Slot } from '../types';
import { formatDate, formatTime, formatCurrency, getServiceTypeIcon } from '../utils';

export function ReviewPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotificationContext();
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const {
    data: booking,
    loading,
    error,
    execute: fetchBookingDetails,
  } = useApi(apiService.getBookingDetails);

  const {
    execute: cancelBooking,
  } = useApi(apiService.cancelBooking);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails(bookingId);
    }
  }, [bookingId, fetchBookingDetails]);

  const handleCancelBooking = async () => {
    if (!bookingId) return;

    setIsCancelling(true);
    try {
      const result = await cancelBooking(bookingId, cancelReason);
      if (result) {
        showSuccess('Booking cancelled successfully');
        setShowCancelForm(false);
        setCancelReason('');
        // Refresh booking details
        fetchBookingDetails(bookingId);
      }
    } catch (error) {
      showError('Failed to cancel booking. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleConfirmBooking = () => {
    showSuccess('Booking confirmed! You will receive a confirmation email shortly.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading booking details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Booking Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary btn-md"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Booking...
          </h1>
          <p className="text-gray-600 mb-6">
            Please wait while we fetch your booking details.
          </p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success-100 text-success-800';
      case 'pending':
        return 'bg-warning-100 text-warning-800';
      case 'cancelled':
        return 'bg-error-100 text-error-800';
      case 'completed':
        return 'bg-primary-100 text-primary-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-success-100 text-success-800';
      case 'pending':
        return 'bg-warning-100 text-warning-800';
      case 'refunded':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper functions to safely access populated data
  const getServiceProvider = (): ServiceProvider | null => {
    return typeof booking.serviceProviderId === 'object' ? booking.serviceProviderId as ServiceProvider : null;
  };

  const getCustomer = (): User | null => {
    return typeof booking.customerId === 'object' ? booking.customerId as User : null;
  };

  const getSlot = (): Slot | null => {
    return typeof booking.slotId === 'object' ? booking.slotId as Slot : null;
  };

  const getServiceProviderUser = (): User | null => {
    const provider = getServiceProvider();
    return provider && typeof provider.userId === 'object' ? provider.userId as User : null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Booking Review
          </h1>
          <p className="text-lg text-gray-600">
            Review your booking details and manage your appointment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Status */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Booking Status
                </h2>
                <div className="flex space-x-2">
                  <span className={`badge ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                  <span className={`badge ${getPaymentStatusColor(booking.paymentStatus)}`}>
                    {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">
                      {getServiceTypeIcon(getServiceProvider()?.serviceType || '')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {getServiceProvider()?.serviceType?.replace('_', ' ').toUpperCase()} Service
                    </h3>
                    <p className="text-sm text-gray-600">
                      Booking ID: {booking._id}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Service Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Service Provider</h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600">
                        {getServiceProviderUser()?.name?.charAt(0) || 'P'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {getServiceProviderUser()?.name || 'Unknown Provider'}
                      </p>
                      <p className="text-sm text-gray-600">
                        ⭐ {getServiceProvider()?.rating || 0} • {getServiceProvider()?.totalBookings || 0} bookings
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      📞 {getServiceProviderUser()?.phone || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                      ✉️ {getServiceProviderUser()?.email || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Appointment Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Date & Time</h3>
                  <div className="space-y-1">
                    <p className="text-gray-600">
                      📅 {formatDate(booking.serviceDate)}
                    </p>
                    <p className="text-gray-600">
                      🕐 {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </p>
                    <p className="text-gray-600">
                      ⏱️ {booking.duration} minutes
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Location</h3>
                  <div className="space-y-1">
                    <p className="text-gray-600">
                      📍 {getServiceProvider()?.location?.area}, {getServiceProvider()?.location?.city}
                    </p>
                    <p className="text-gray-600">
                      📮 {getServiceProvider()?.location?.pincode}
                    </p>
                  </div>
                </div>
              </div>

              {booking.notes && (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Special Instructions</h3>
                  <p className="text-gray-600 bg-gray-50 rounded-lg p-3">
                    {booking.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Cancellation Details */}
            {booking.status === 'cancelled' && booking.cancellationReason && (
              <div className="card p-6 border-error-200 bg-error-50">
                <h2 className="text-lg font-semibold text-error-900 mb-2">
                  Cancellation Details
                </h2>
                <p className="text-error-800">
                  <strong>Reason:</strong> {booking.cancellationReason}
                </p>
                <p className="text-sm text-error-700 mt-2">
                  Cancelled on {formatDate(booking.updatedAt)}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Booking Summary
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-medium">{formatCurrency(booking.totalAmount)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{booking.duration} minutes</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                    <span className="text-xl font-bold text-primary-600">
                      {formatCurrency(booking.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                {booking.status === 'pending' && (
                  <button
                    onClick={handleConfirmBooking}
                    className="w-full btn btn-success btn-md"
                  >
                    Confirm Booking
                  </button>
                )}

                {booking.status === 'confirmed' && (
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate('/')}
                      className="w-full btn btn-primary btn-md"
                    >
                      Book Another Service
                    </button>
                    <button
                      onClick={() => setShowCancelForm(true)}
                      className="w-full btn btn-outline btn-md"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}

                {booking.status === 'cancelled' && (
                  <button
                    onClick={() => navigate('/')}
                    className="w-full btn btn-primary btn-md"
                  >
                    Book New Service
                  </button>
                )}

                {booking.status === 'completed' && (
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate('/')}
                      className="w-full btn btn-primary btn-md"
                    >
                      Book Another Service
                    </button>
                    {!booking.rating && (
                      <button
                        onClick={() => {/* TODO: Implement rating */}}
                        className="w-full btn btn-outline btn-md"
                      >
                        Rate Service
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cancel Booking Modal */}
        {showCancelForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Cancel Booking
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for cancellation (optional)
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="input w-full h-24 resize-none"
                  placeholder="Please let us know why you're cancelling..."
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCancelForm(false)}
                  className="flex-1 btn btn-secondary btn-md"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancelBooking}
                  disabled={isCancelling}
                  className="flex-1 btn btn-error btn-md"
                >
                  {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
