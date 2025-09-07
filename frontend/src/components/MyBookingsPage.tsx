import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';
import { apiService } from '../services/api';
import { Booking, ServiceProvider, User, Slot } from '../types';
import { formatDate, formatTime, formatCurrency, getServiceTypeIcon } from '../utils';

export function MyBookingsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const {
    data: bookings,
    loading,
    error,
    execute: fetchUserBookings,
  } = useApi(apiService.getUserBookings);

  // Use the authenticated user's ID
  useEffect(() => {
    if (user && isAuthenticated) {
      console.log('Fetching bookings for user:', user._id);
      fetchUserBookings(user._id);
    }
  }, [user, isAuthenticated, fetchUserBookings]);

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
  const getServiceProvider = (booking: Booking): ServiceProvider | null => {
    return typeof booking.serviceProviderId === 'object' ? booking.serviceProviderId as ServiceProvider : null;
  };


  const getServiceProviderUser = (booking: Booking): User | null => {
    const provider = getServiceProvider(booking);
    return provider && typeof provider.userId === 'object' ? provider.userId as User : null;
  };

  const handleViewBooking = (bookingId: string) => {
    navigate(`/review/${bookingId}`);
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Authentication Required
          </h1>
          <p className="text-gray-600 mb-6">
            Please log in to view your bookings.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn btn-primary btn-md"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading your bookings..." />
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
            Error Loading Bookings
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            My Bookings
          </h1>
        </div>

        {/* Bookings List */}
        {!bookings || bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Bookings Yet
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't made any bookings yet. Start by booking a service!
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn btn-primary btn-md"
            >
              Book a Service
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="card p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  {/* Booking Info */}
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      {/* Service Icon */}
                      <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-3xl">
                          {getServiceTypeIcon(getServiceProvider(booking)?.serviceType || '')}
                        </span>
                      </div>

                      {/* Booking Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {getServiceProvider(booking)?.serviceType?.replace('_', ' ').toUpperCase()} Service
                          </h3>
                          <span className={`badge ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                          <span className={`badge ${getPaymentStatusColor(booking.paymentStatus)}`}>
                            {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <p><strong>Service Provider:</strong> {getServiceProviderUser(booking)?.name || 'Unknown'}</p>
                            <p><strong>Date:</strong> {formatDate(booking.serviceDate)}</p>
                            <p><strong>Time:</strong> {formatTime(booking.startTime)} - {formatTime(booking.endTime)}</p>
                          </div>
                          <div>
                            <p><strong>Duration:</strong> {booking.duration} minutes</p>
                            <p><strong>Total Amount:</strong> {formatCurrency(booking.totalAmount)}</p>
                            <p><strong>Booking ID:</strong> {booking._id.slice(-8)}</p>
                          </div>
                        </div>

                        {booking.notes && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600">
                              <strong>Notes:</strong> {booking.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col space-y-2">
                    <button
                      onClick={() => handleViewBooking(booking._id)}
                      className="btn btn-primary btn-sm"
                    >
                      View Details
                    </button>
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleViewBooking(booking._id)}
                        className="btn btn-outline btn-sm"
                      >
                        Contact Provider
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary btn-lg"
          >
            Book Another Service
          </button>
        </div>
      </div>
    </div>
  );
}
