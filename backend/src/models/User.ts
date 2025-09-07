import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'customer' | 'service_provider';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  },
  password: {
    type: String,
    required: function(this: any) {
      // Password is required only for service providers or when explicitly provided
      return this.role === 'service_provider' || this.password !== undefined;
    },
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: ['customer', 'service_provider'],
    required: [true, 'Role is required'],
    default: 'customer'
  }
}, {
  timestamps: true,
  versionKey: false
});

// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

// Ensure model is only created once
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
