import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  _id: string;
  customerId: string;
  serviceProviderId: string;
  slotId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  bookingDate: Date;
  serviceDate: Date;
  startTime: string;
  endTime: string;
  duration: number;
  notes?: string;
  rating?: number;
  review?: string;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer ID is required']
  },
  serviceProviderId: {
    type: Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: [true, 'Service provider ID is required']
  },
  slotId: {
    type: Schema.Types.ObjectId,
    ref: 'Slot',
    required: [true, 'Slot ID is required'],
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  serviceDate: {
    type: Date,
    required: [true, 'Service date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [15, 'Duration must be at least 15 minutes']
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
    trim: true
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  review: {
    type: String,
    maxlength: [1000, 'Review cannot exceed 1000 characters'],
    trim: true
  },
  cancellationReason: {
    type: String,
    maxlength: [500, 'Cancellation reason cannot exceed 500 characters'],
    trim: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes for better query performance
BookingSchema.index({ customerId: 1, status: 1 });
BookingSchema.index({ serviceProviderId: 1, status: 1 });
BookingSchema.index({ serviceDate: 1, status: 1 });
BookingSchema.index({ status: 1, paymentStatus: 1 });

// Ensure model is only created once
const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
export default Booking;
