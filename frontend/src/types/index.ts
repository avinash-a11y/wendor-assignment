export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'service_provider';
  createdAt: string;
  updatedAt: string;
}

export interface ServiceProvider {
  _id: string;
  userId: string | User;
  serviceType: ServiceType;
  experience: number;
  rating: number;
  totalBookings: number;
  hourlyRate: number;
  isActive: boolean;
  workingHours: {
    start: string;
    end: string;
  };
  workingDays: number[];
  location: {
    city: string;
    area: string;
    pincode: string;
  };
  skills: string[];
  bio: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Slot {
  _id: string;
  serviceProviderId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  price: number;
  isAvailable: boolean;
  isBooked: boolean;
  bookingId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  customerId: string | User;
  serviceProviderId: string | ServiceProvider;
  slotId: string | Slot;
  status: BookingStatus;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  bookingDate: string;
  serviceDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  notes?: string;
  rating?: number;
  review?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  customer?: User;
  serviceProvider?: ServiceProvider;
  slot?: Slot;
}

export type ServiceType = 
  | 'electrician' 
  | 'carpenter' 
  | 'plumber' 
  | 'car_washer' 
  | 'painter' 
  | 'cleaner';

export type BookingStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'cancelled' 
  | 'completed';

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'refunded';

export interface ServiceTypeOption {
  value: ServiceType;
  label: string;
  icon: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  errors?: any[];
  error?: string;
}

export interface BookingFormData {
  slotId: string;
  customerId: string;
  notes?: string;
}

export interface CancelBookingFormData {
  reason?: string;
}

export interface SlotFilters {
  serviceType?: ServiceType;
  city?: string;
  area?: string;
  minRating?: number;
  maxPrice?: number;
  date?: string;
}

export interface RealTimeEvent {
  type: 'slot-update' | 'booking-update' | 'system-notification';
  data: any;
  timestamp: string;
}

export interface SlotUpdateEvent {
  serviceProviderId: string;
  slotId: string;
  action: 'booked' | 'cancelled' | 'updated';
  slot?: Slot;
  booking?: Booking;
}

export interface BookingUpdateEvent {
  bookingId: string;
  customerId: string;
  action: 'created' | 'confirmed' | 'cancelled' | 'completed';
  booking?: Booking;
}

export interface SystemNotificationEvent {
  message: string;
  type: 'info' | 'warning' | 'error';
  timestamp: string;
}

// UI State types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface BookingState {
  selectedServiceProvider?: ServiceProvider;
  selectedDate?: Date;
  selectedSlot?: Slot;
  booking?: Booking;
  isBooking: boolean;
  isCancelling: boolean;
}

export interface NotificationState {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  duration?: number;
}
