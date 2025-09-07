import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import ServiceProvider from '../models/ServiceProvider';
import Slot from '../models/Slot';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/urban-company-booking';

const serviceTypes = ['electrician', 'carpenter', 'plumber', 'car_washer', 'painter', 'cleaner'] as const;
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'];
const areas = ['Central', 'North', 'South', 'East', 'West'];

const generateTimeSlots = (startHour: number, endHour: number) => {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
    slots.push({ startTime, endTime });
  }
  return slots;
};

const seedProductionDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB for production seeding');

    // Clear existing data
    await User.deleteMany({});
    await ServiceProvider.deleteMany({});
    await Slot.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create users
    const users = [];
    for (let i = 1; i <= 30; i++) {
      const user = new User({
        name: `User ${i}`,
        email: `user${i}@example.com`,
        phone: `+91${9000000000 + i}`,
        role: i <= 15 ? 'service_provider' : 'customer'
      });
      users.push(await user.save());
    }
    console.log(`👥 Created ${users.length} users`);

    // Create service providers
    const serviceProviders = [];
    const serviceProviderUsers = users.filter(user => user.role === 'service_provider');
    
    for (let i = 0; i < serviceProviderUsers.length; i++) {
      const user = serviceProviderUsers[i];
      const serviceType = serviceTypes[i % serviceTypes.length];
      const city = cities[i % cities.length];
      const area = areas[i % areas.length];
      
      const serviceProvider = new ServiceProvider({
        userId: user._id,
        serviceType,
        experience: Math.floor(Math.random() * 15) + 1,
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 to 5.0
        totalBookings: Math.floor(Math.random() * 200),
        hourlyRate: Math.floor(Math.random() * 800) + 300, // 300 to 1100
        isActive: true,
        workingHours: {
          start: '09:00',
          end: '18:00'
        },
        workingDays: [1, 2, 3, 4, 5, 6], // Monday to Saturday
        location: {
          city,
          area,
          pincode: `${100000 + Math.floor(Math.random() * 900000)}`
        },
        skills: [
          `${serviceType} work`,
          'Emergency services',
          'Quality assurance',
          'Customer satisfaction'
        ],
        bio: `Experienced ${serviceType} with ${Math.floor(Math.random() * 15) + 1} years of experience. Committed to providing quality service and customer satisfaction.`
      });
      
      serviceProviders.push(await serviceProvider.save());
    }
    console.log(`🔧 Created ${serviceProviders.length} service providers`);

    // Create slots for the next 14 days
    const slots = [];
    const timeSlots = generateTimeSlots(9, 18); // 9 AM to 6 PM
    
    for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
      const date = new Date();
      date.setDate(date.getDate() + dayOffset);
      date.setHours(0, 0, 0, 0);
      
      for (const serviceProvider of serviceProviders) {
        for (const timeSlot of timeSlots) {
          // Randomly make some slots unavailable
          const isAvailable = Math.random() > 0.2; // 80% availability
          
          const slot = new Slot({
            serviceProviderId: serviceProvider._id,
            date,
            startTime: timeSlot.startTime,
            endTime: timeSlot.endTime,
            duration: 60,
            price: serviceProvider.hourlyRate,
            isAvailable,
            isBooked: !isAvailable && Math.random() > 0.3 // Some unavailable slots are booked
          });
          
          slots.push(await slot.save());
        }
      }
    }
    console.log(`📅 Created ${slots.length} slots`);

    console.log('✅ Production database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${users.length}`);
    console.log(`- Service Providers: ${serviceProviders.length}`);
    console.log(`- Slots: ${slots.length}`);
    console.log('\n🚀 Production data ready for deployment');

  } catch (error) {
    console.error('❌ Error seeding production database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedProductionDatabase();
}

export default seedProductionDatabase;
