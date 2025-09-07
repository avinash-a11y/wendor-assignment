import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, ServiceProvider, Slot, Booking, ServiceTypeOption } from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'https://wendor-backend-eta.vercel.app/api', // Use proxy from package.json
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Service Provider APIs
  getServiceProviders = async (filters?: {
    serviceType?: string;
    city?: string;
    area?: string;
    minRating?: number;
    maxPrice?: number;
  }): Promise<ApiResponse<ServiceProvider[]>> => {
    const response = await this.api.get('/service-providers', { params: filters });
    return response.data;
  }

  getServiceProviderDetails = async (serviceProviderId: string): Promise<ApiResponse<ServiceProvider>> => {
    const response = await this.api.get(`/service-providers/${serviceProviderId}`);
    return response.data;
  }

  getServiceTypes = async (): Promise<ApiResponse<ServiceTypeOption[]>> => {
    const response = await this.api.get('/service-providers/types');
    return response.data;
  }

  // Booking APIs
  getAvailableSlots = async (
    serviceProviderId: string,
    date: string
  ): Promise<ApiResponse<Slot[]>> => {
    const response = await this.api.get('/bookings/slots', {
      params: { serviceProviderId, date },
    });
    return response.data;
  }

  bookSlot = async (bookingData: {
    slotId: string;
    customerId?: string;
    customerInfo?: {
      name: string;
      email: string;
      phone: string;
      address: string;
    };
    notes?: string;
  }): Promise<ApiResponse<Booking>> => {
    const response = await this.api.post('/bookings/book', bookingData);
    return response.data;
  }

  getBookingDetails = async (bookingId: string): Promise<ApiResponse<Booking>> => {
    const response = await this.api.get(`/bookings/${bookingId}`);
    return response.data;
  }

  cancelBooking = async (
    bookingId: string,
    reason?: string
  ): Promise<ApiResponse<Booking>> => {
    const response = await this.api.patch(`/bookings/${bookingId}/cancel`, {
      reason,
    });
    return response.data;
  }

  getUserBookings = async (userId: string): Promise<ApiResponse<Booking[]>> => {
    const response = await this.api.get(`/bookings/user/${userId}`);
    return response.data;
  }

  // Service Provider Registration
  registerServiceProvider = async (providerData: {
    name: string;
    email: string;
    phone: string;
    serviceType: string;
    experience: number;
    hourlyRate: number;
    workingDays: number[];
    description: string;
    address: string;
  }): Promise<ApiResponse<any>> => {
    const response = await this.api.post('/service-providers/register', providerData);
    return response.data;
  }

  // Health check
  healthCheck = async (): Promise<ApiResponse> => {
    const response = await this.api.get('/health');
    return response.data;
  }
}

// Create singleton instance
export const apiService = new ApiService();
export default apiService;
