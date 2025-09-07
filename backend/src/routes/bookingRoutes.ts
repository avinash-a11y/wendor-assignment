import { Router } from 'express';
import { BookingController } from '../controllers/BookingController';
import { 
  validateBookingSlot, 
  validateGetSlots, 
  validateBookingId, 
  validateUserId,
  validateCancelBooking 
} from '../middleware/validation';

const router = Router();
const bookingController = new BookingController();

// Get available slots for a service provider
router.get('/slots', validateGetSlots, bookingController.getAvailableSlots.bind(bookingController));

// Book a slot
router.post('/book', validateBookingSlot, bookingController.bookSlot.bind(bookingController));

// Get booking details
router.get('/:bookingId', validateBookingId, bookingController.getBookingDetails.bind(bookingController));

// Cancel booking
router.patch('/:bookingId/cancel', validateBookingId, validateCancelBooking, bookingController.cancelBooking.bind(bookingController));

// Get user bookings
router.get('/user/:userId', validateUserId, bookingController.getUserBookings.bind(bookingController));

export default router;
