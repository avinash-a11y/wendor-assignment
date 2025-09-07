import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

export class ServiceProviderController {
  private getServiceProviderModel() {
    return mongoose.model('ServiceProvider');
  }

  // Get all service providers by service type
  async getServiceProviders(req: Request, res: Response): Promise<void> {
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

      const { serviceType, city, area, minRating, maxPrice } = req.query;
      
      // Build filter object
      const filter: any = { isActive: true };
      
      if (serviceType) {
        filter.serviceType = serviceType;
      }
      
      if (city) {
        filter['location.city'] = new RegExp(city as string, 'i');
      }
      
      if (area) {
        filter['location.area'] = new RegExp(area as string, 'i');
      }
      
      if (minRating) {
        filter.rating = { $gte: parseFloat(minRating as string) };
      }
      
      if (maxPrice) {
        filter.hourlyRate = { $lte: parseFloat(maxPrice as string) };
      }

      const ServiceProvider = this.getServiceProviderModel();
      const serviceProviders = await ServiceProvider
        .find(filter)
        .populate('userId', 'name email phone')
        .sort({ rating: -1, totalBookings: -1 })
        .limit(50);

      res.status(200).json({
        success: true,
        data: serviceProviders,
        message: 'Service providers fetched successfully'
      });
    } catch (error) {
      console.error('Error fetching service providers:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get service provider details
  async getServiceProviderDetails(req: Request, res: Response): Promise<void> {
    try {
      const { serviceProviderId } = req.params;

      if (!serviceProviderId) {
        res.status(400).json({
          success: false,
          message: 'Service provider ID is required'
        });
        return;
      }

      const ServiceProvider = this.getServiceProviderModel();
      const serviceProvider = await ServiceProvider
        .findById(serviceProviderId)
        .populate('userId', 'name email phone');

      if (!serviceProvider) {
        res.status(404).json({
          success: false,
          message: 'Service provider not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: serviceProvider,
        message: 'Service provider details fetched successfully'
      });
    } catch (error) {
      console.error('Error fetching service provider details:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get service types
  async getServiceTypes(req: Request, res: Response): Promise<void> {
    try {
      const serviceTypes = [
        { value: 'electrician', label: 'Electrician', icon: '⚡' },
        { value: 'carpenter', label: 'Carpenter', icon: '🔨' },
        { value: 'plumber', label: 'Plumber', icon: '🔧' },
        { value: 'car_washer', label: 'Car Washer', icon: '🚗' },
        { value: 'painter', label: 'Painter', icon: '🎨' },
        { value: 'cleaner', label: 'Cleaner', icon: '🧹' }
      ];

      res.status(200).json({
        success: true,
        data: serviceTypes,
        message: 'Service types fetched successfully'
      });
    } catch (error) {
      console.error('Error fetching service types:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
