import { Request, Response } from 'express';
import mongoose from 'mongoose';

interface ServiceProviderRegistrationRequest extends Request {
  body: {
    name: string;
    email: string;
    phone: string;
    serviceType: string;
    experience: number;
    hourlyRate: number;
    workingDays: number[];
    description: string;
    address: string;
  };
}

export class ServiceProviderRegistrationController {
  async registerServiceProvider(req: ServiceProviderRegistrationRequest, res: Response) {
    try {
      const {
        name,
        email,
        phone,
        serviceType,
        experience,
        hourlyRate,
        workingDays,
        description,
        address
      } = req.body;

      // Validate required fields
      if (!name || !email || !phone || !serviceType || !address) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: name, email, phone, serviceType, and address are required'
        });
      }

      // Validate working days
      if (!workingDays || workingDays.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one working day must be selected'
        });
      }

      // Get models
      const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}));
      const ServiceProvider = mongoose.models.ServiceProvider || mongoose.model('ServiceProvider', new mongoose.Schema({}));

      // Check if user already exists
      let user = await User.findOne({ email });
      
      if (!user) {
        // Create new user
        user = new User({
          name,
          email,
          phone,
          address,
          role: 'service_provider'
        });
        await user.save();
      } else {
        // Update existing user
        user.name = name;
        user.phone = phone;
        user.address = address;
        user.role = 'service_provider';
        await user.save();
      }

      // Check if service provider already exists for this user
      let serviceProvider = await ServiceProvider.findOne({ userId: user._id });
      
      if (serviceProvider) {
        // Update existing service provider
        serviceProvider.serviceType = serviceType;
        serviceProvider.experience = experience || 0;
        serviceProvider.hourlyRate = hourlyRate || 0;
        serviceProvider.workingDays = workingDays;
        serviceProvider.bio = description || '';
        serviceProvider.isActive = true;
        serviceProvider.workingHours = {
          start: "09:00",
          end: "18:00"
        };
        serviceProvider.location = {
          city: "Mumbai",
          area: "Central", 
          pincode: "400001"
        };
        serviceProvider.skills = [serviceType];
        await serviceProvider.save();
      } else {
        // Create new service provider
        serviceProvider = new ServiceProvider({
          userId: user._id,
          serviceType,
          experience: experience || 0,
          hourlyRate: hourlyRate || 0,
          workingDays,
          bio: description || '',
          rating: 5.0, // Default rating
          totalBookings: 0,
          isActive: true,
          workingHours: {
            start: "09:00",
            end: "18:00"
          },
          location: {
            city: "Mumbai", // Default city
            area: "Central",
            pincode: "400001"
          },
          skills: [serviceType]
        });
        await serviceProvider.save();
      }

      return res.status(201).json({
        success: true,
        message: 'Service provider registration successful',
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone
          },
          serviceProvider: {
            _id: serviceProvider._id,
            serviceType: serviceProvider.serviceType,
            experience: serviceProvider.experience,
            hourlyRate: serviceProvider.hourlyRate,
            workingDays: serviceProvider.workingDays
          }
        }
      });

    } catch (error: any) {
      console.error('Service provider registration error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during registration',
        error: error.message
      });
    }
  }
}

export default new ServiceProviderRegistrationController();
