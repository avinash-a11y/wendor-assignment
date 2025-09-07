import mongoose, { Document, Schema } from 'mongoose';

export interface IServiceProvider extends Document {
  _id: string;
  userId: string;
  serviceType: 'electrician' | 'carpenter' | 'plumber' | 'car_washer' | 'painter' | 'cleaner';
  experience: number;
  rating: number;
  totalBookings: number;
  hourlyRate: number;
  isActive: boolean;
  workingHours: {
    start: string; // Format: "09:00"
    end: string;   // Format: "18:00"
  };
  workingDays: number[]; // 0-6 (Sunday-Saturday)
  location: {
    city: string;
    area: string;
    pincode: string;
  };
  skills: string[];
  bio: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceProviderSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
  },
  serviceType: {
    type: String,
    enum: ['electrician', 'carpenter', 'plumber', 'car_washer', 'painter', 'cleaner'],
    required: [true, 'Service type is required']
  },
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: [0, 'Experience cannot be negative'],
    max: [50, 'Experience cannot exceed 50 years']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  totalBookings: {
    type: Number,
    default: 0,
    min: [0, 'Total bookings cannot be negative']
  },
  hourlyRate: {
    type: Number,
    required: [true, 'Hourly rate is required'],
    min: [0, 'Hourly rate cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  workingHours: {
    start: {
      type: String,
      required: [true, 'Working start time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM']
    },
    end: {
      type: String,
      required: [true, 'Working end time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM']
    }
  },
  workingDays: [{
    type: Number,
    min: 0,
    max: 6
  }],
  location: {
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    area: {
      type: String,
      required: [true, 'Area is required'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^\d{6}$/, 'Pincode must be 6 digits']
    }
  },
  skills: [{
    type: String,
    trim: true
  }],
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    trim: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes for better query performance
ServiceProviderSchema.index({ serviceType: 1, isActive: 1 });
ServiceProviderSchema.index({ 'location.city': 1, 'location.area': 1 });
ServiceProviderSchema.index({ rating: -1 });
ServiceProviderSchema.index({ hourlyRate: 1 });

// Ensure model is only created once
const ServiceProvider = mongoose.models.ServiceProvider || mongoose.model<IServiceProvider>('ServiceProvider', ServiceProviderSchema);
export default ServiceProvider;
