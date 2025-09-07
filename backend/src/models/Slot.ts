import mongoose, { Document, Schema } from 'mongoose';

export interface ISlot extends Document {
  _id: string;
  serviceProviderId: string;
  date: Date;
  startTime: string; // Format: "09:00"
  endTime: string;   // Format: "10:00"
  duration: number;  // in minutes
  price: number;
  isAvailable: boolean;
  isBooked: boolean;
  bookingId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SlotSchema: Schema = new Schema({
  serviceProviderId: {
    type: Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: [true, 'Service provider ID is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
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
    min: [15, 'Duration must be at least 15 minutes'],
    max: [480, 'Duration cannot exceed 8 hours']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    default: null
  }
}, {
  timestamps: true,
  versionKey: false
});

// Compound index for efficient queries
SlotSchema.index({ serviceProviderId: 1, date: 1, startTime: 1 });
SlotSchema.index({ date: 1, isAvailable: 1, isBooked: 1 });
SlotSchema.index({ bookingId: 1 });

// Ensure unique slots per service provider
SlotSchema.index({ serviceProviderId: 1, date: 1, startTime: 1 }, { unique: true });

// Ensure model is only created once
const Slot = mongoose.models.Slot || mongoose.model<ISlot>('Slot', SlotSchema);
export default Slot;
