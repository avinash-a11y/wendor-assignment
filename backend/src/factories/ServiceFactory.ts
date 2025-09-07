import { IServiceProvider } from '../models/ServiceProvider';
import { ISlot } from '../models/Slot';
import { IBooking } from '../models/Booking';
import { lockService } from '../services/LockService';

export interface IService {
  getAvailableSlots(serviceProviderId: string, date: Date): Promise<ISlot[]>;
  bookSlot(slotId: string, customerId: string, notes?: string): Promise<IBooking>;
  cancelBooking(bookingId: string, reason?: string): Promise<IBooking>;
  getBookingDetails(bookingId: string): Promise<IBooking | null>;
  getUserBookings(userId: string): Promise<IBooking[]>;
}

export class SlotBookingService implements IService {
  constructor(
    private slotModel: any,
    private bookingModel: any,
    private serviceProviderModel: any
  ) {}

  async getAvailableSlots(serviceProviderId: string, date: Date): Promise<ISlot[]> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const slots = await this.slotModel.find({
        serviceProviderId,
        date: {
          $gte: startOfDay,
          $lte: endOfDay
        },
        isAvailable: true,
        isBooked: false
      }).sort({ startTime: 1 });

      return slots;
    } catch (error) {
      throw new Error(`Failed to fetch available slots: ${error}`);
    }
  }

  async bookSlot(slotId: string, customerId: string, notes?: string): Promise<IBooking> {
    const lockKey = `slot-booking-${slotId}`;
    const lockId = `lock-${Date.now()}-${Math.random()}`;
    
    // Try to acquire lock with retry mechanism
    const lockAcquired = await lockService.acquireLock(lockKey, {
      ttl: 30000, // 30 seconds
      retryDelay: 50, // 50ms between retries
      maxRetries: 20 // 20 retries = 1 second max wait
    });

    if (!lockAcquired) {
      throw new Error('Slot is currently being booked by another user. Please try again.');
    }

    const session = await this.slotModel.db.startSession();
    
    try {
      return await session.withTransaction(async () => {
        // Find and lock the slot
        const slot = await this.slotModel.findById(slotId).session(session);
        
        if (!slot) {
          throw new Error('Slot not found');
        }

        if (!slot.isAvailable || slot.isBooked) {
          throw new Error('Slot is no longer available');
        }

        // Get service provider details
        const serviceProvider = await this.serviceProviderModel.findById(slot.serviceProviderId);
        if (!serviceProvider) {
          throw new Error('Service provider not found');
        }

        // Create booking
        const booking = new this.bookingModel({
          customerId,
          serviceProviderId: slot.serviceProviderId,
          slotId: slot._id,
          totalAmount: slot.price,
          serviceDate: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          duration: slot.duration,
          notes,
          status: 'confirmed'
        });

        const savedBooking = await booking.save({ session });

        // Update slot status
        slot.isAvailable = false;
        slot.isBooked = true;
        slot.bookingId = savedBooking._id;
        await slot.save({ session });

        // Update service provider booking count
        await this.serviceProviderModel.findByIdAndUpdate(
          slot.serviceProviderId,
          { $inc: { totalBookings: 1 } },
          { session }
        );


        return savedBooking;
      });
    } catch (error) {
      throw new Error(`Failed to book slot: ${error}`);
    } finally {
      await session.endSession();
      // Release the lock
      await lockService.releaseLock(lockKey, lockId);
    }
  }

  async cancelBooking(bookingId: string, reason?: string): Promise<IBooking> {
    const session = await this.bookingModel.db.startSession();
    
    try {
      return await session.withTransaction(async () => {
        const booking = await this.bookingModel.findById(bookingId).session(session);
        
        if (!booking) {
          throw new Error('Booking not found');
        }

        if (booking.status === 'cancelled') {
          throw new Error('Booking is already cancelled');
        }

        if (booking.status === 'completed') {
          throw new Error('Cannot cancel completed booking');
        }

        // Update booking status
        booking.status = 'cancelled';
        booking.cancellationReason = reason;
        booking.paymentStatus = 'refunded';
        await booking.save({ session });

        // Free up the slot
        await this.slotModel.findByIdAndUpdate(
          booking.slotId,
          {
            isAvailable: true,
            isBooked: false,
            bookingId: null
          },
          { session }
        );

        return booking;
      });
    } catch (error) {
      throw new Error(`Failed to cancel booking: ${error}`);
    } finally {
      await session.endSession();
    }
  }

  async getBookingDetails(bookingId: string): Promise<IBooking | null> {
    try {
      return await this.bookingModel
        .findById(bookingId)
        .populate('customerId', 'name email phone')
        .populate('serviceProviderId', 'serviceType hourlyRate')
        .populate('slotId', 'date startTime endTime price');
    } catch (error) {
      throw new Error(`Failed to fetch booking details: ${error}`);
    }
  }

  async getUserBookings(userId: string): Promise<IBooking[]> {
    try {
      return await this.bookingModel
        .find({ customerId: userId })
        .populate('serviceProviderId', 'serviceType hourlyRate')
        .populate('slotId', 'date startTime endTime price')
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Failed to fetch user bookings: ${error}`);
    }
  }
}

export class ServiceFactory {
  static createSlotBookingService(
    slotModel: any,
    bookingModel: any,
    serviceProviderModel: any
  ): IService {
    return new SlotBookingService(slotModel, bookingModel, serviceProviderModel);
  }
}
