import { Request, Response } from 'express';
import { ServiceFactory } from '../factories/ServiceFactory';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

export class BookingController {
  private bookingService: any;

  private getSlotModel() {
    return mongoose.model('Slot');
  }

  private getBookingModel() {
    return mongoose.model('Booking');
  }

  private getServiceProviderModel() {
    return mongoose.model('ServiceProvider');
  }

  private getUserModel() {
    return mongoose.models.User || mongoose.model('User', new mongoose.Schema({}));
  }

  constructor() {
    // Initialize booking service in constructor to access app settings
  }

  private getBookingService(req: Request) {
    if (!this.bookingService) {
      this.bookingService = ServiceFactory.createSlotBookingService(
        this.getSlotModel(),
        this.getBookingModel(),
        this.getServiceProviderModel()
      );
    }
    return this.bookingService;
  }

  // Get available slots for a service provider on a specific date
  async getAvailableSlots(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
        return;
      }

      const { serviceProviderId, date } = req.query;
      
      if (!serviceProviderId || !date) {
        res.status(400).json({
          success: false,
          message: 'Service provider ID and date are required'
        });
        return;
      }

      const targetDate = new Date(date as string);
      if (isNaN(targetDate.getTime())) {
        res.status(400).json({
          success: false,
          message: 'Invalid date format'
        });
        return;
      }

      const bookingService = this.getBookingService(req);
      const slots = await bookingService.getAvailableSlots(
        serviceProviderId as string,
        targetDate
      );

      res.status(200).json({
        success: true,
        data: slots,
        message: 'Available slots fetched successfully'
      });
    } catch (error) {
      console.error('Error fetching available slots:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Book a slot
  async bookSlot(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
        return;
      }

      const { slotId, customerId, customerInfo, notes } = req.body;

      if (!slotId) {
        res.status(400).json({
          success: false,
          message: 'Slot ID is required'
        });
        return;
      }

      // Get models
      const User = this.getUserModel();
      const Booking = this.getBookingModel();
      const Slot = this.getSlotModel();
      const ServiceProvider = this.getServiceProviderModel();

      let customer;
      
      if (customerId) {
        // Use existing customer
        customer = await User.findById(customerId);
        if (!customer) {
          res.status(404).json({
            success: false,
            message: 'Customer not found'
          });
          return;
        }
      } else if (customerInfo) {
        // Check if customer already exists by email
        customer = await User.findOne({ email: customerInfo.email });
        
        if (!customer) {
          // Create new customer without password (for booking purposes)
          customer = new User({
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone,
            role: 'customer'
          });
          await customer.save();
        } else {
          // Update existing customer info
          customer.name = customerInfo.name;
          customer.phone = customerInfo.phone;
          customer.address = customerInfo.address;
          customer.role = 'customer';
          await customer.save();
        }
      } else {
        res.status(400).json({
          success: false,
          message: 'Either customerId or customerInfo is required'
        });
        return;
      }

      // Find the slot
      const slot = await Slot.findById(slotId);
      if (!slot) {
        res.status(404).json({
          success: false,
          message: 'Slot not found'
        });
        return;
      }

      if (!slot.isAvailable || slot.isBooked) {
        res.status(409).json({
          success: false,
          message: 'Slot is no longer available'
        });
        return;
      }

      // Get service provider details
      const serviceProvider = await ServiceProvider.findById(slot.serviceProviderId);
      if (!serviceProvider) {
        res.status(404).json({
          success: false,
          message: 'Service provider not found'
        });
        return;
      }

      // Create booking
      const booking = new Booking({
        customerId: customer._id,
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

      const savedBooking = await booking.save();

      // Update slot status
      slot.isAvailable = false;
      slot.isBooked = true;
      slot.bookingId = savedBooking._id;
      await slot.save();

      // Update service provider booking count
      serviceProvider.totalBookings = (serviceProvider.totalBookings || 0) + 1;
      await serviceProvider.save();

      res.status(201).json({
        success: true,
        data: savedBooking,
        message: 'Slot booked successfully'
      });
    } catch (error) {
      console.error('Error booking slot:', error);
      
      if (error instanceof Error && error.message.includes('no longer available')) {
        res.status(409).json({
          success: false,
          message: 'Slot is no longer available',
          error: error.message
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get booking details
  async getBookingDetails(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;

      if (!bookingId) {
        res.status(400).json({
          success: false,
          message: 'Booking ID is required'
        });
        return;
      }

      // Get models
      const Booking = this.getBookingModel();
      const User = this.getUserModel();
      const ServiceProvider = this.getServiceProviderModel();
      const Slot = this.getSlotModel();

      // Find booking with populated references
      const booking = await Booking.findById(bookingId)
        .populate('customerId', 'name email phone address')
        .populate({
          path: 'serviceProviderId',
          populate: {
            path: 'userId',
            select: 'name email phone'
          }
        })
        .populate('slotId', 'date startTime endTime price duration');

      if (!booking) {
        res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: booking,
        message: 'Booking details fetched successfully'
      });
    } catch (error) {
      console.error('Error fetching booking details:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Cancel booking
  async cancelBooking(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
        return;
      }

      const { bookingId } = req.params;
      const { reason } = req.body;

      if (!bookingId) {
        res.status(400).json({
          success: false,
          message: 'Booking ID is required'
        });
        return;
      }

      const bookingService = this.getBookingService(req);
      const booking = await bookingService.cancelBooking(bookingId, reason);

      res.status(200).json({
        success: true,
        data: booking,
        message: 'Booking cancelled successfully'
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      
      if (error instanceof Error && (
        error.message.includes('not found') ||
        error.message.includes('already cancelled') ||
        error.message.includes('Cannot cancel completed')
      )) {
        res.status(400).json({
          success: false,
          message: error.message
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get user bookings
  async getUserBookings(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }

      // Get models
      const Booking = this.getBookingModel();

      // Find all bookings for the user with populated references
      const bookings = await Booking.find({ customerId: userId })
        .populate('customerId', 'name email phone address')
        .populate({
          path: 'serviceProviderId',
          populate: {
            path: 'userId',
            select: 'name email phone'
          }
        })
        .populate('slotId', 'date startTime endTime price duration')
        .sort({ createdAt: -1 }); // Most recent first

      res.status(200).json({
        success: true,
        data: bookings,
        message: 'User bookings fetched successfully'
      });
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
