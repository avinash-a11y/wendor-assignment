# ServicePro - Professional Home Services Platform

## 📋 Project Overview

ServicePro is a modern, full-stack web application that connects customers with professional service providers for home and vehicle services. Built with the MERN stack (MongoDB, Express.js, React, Node.js) and TypeScript, it provides a seamless booking experience similar to platforms like Urban Company.

## 🚀 Features

### For Customers
- **User Authentication**: Secure signup/login with JWT tokens
- **Service Booking**: Step-by-step booking process with progress tracking
- **Service Provider Selection**: Browse and select from verified professionals
- **Real-time Slot Booking**: View and book available time slots
- **Booking Management**: View, track, and manage all bookings
- **Professional UI/UX**: Clean, intuitive interface designed for all age groups

### For Service Providers
- **Provider Registration**: Comprehensive registration form for professionals
- **Service Management**: Manage service types, pricing, and availability
- **Location-based Services**: Serve customers in specific areas
- **Booking Notifications**: Receive and manage booking requests

### Technical Features
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Type Safety**: Full TypeScript implementation for better code quality
- **Real-time Updates**: Live booking status updates
- **Error Handling**: Comprehensive error handling and user feedback
- **Form Validation**: Client and server-side validation
- **Professional Architecture**: Clean, maintainable code structure

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **Context API** for state management
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Rate Limiting** for security
- **CORS** for cross-origin requests

### Development Tools
- **Concurrently** for running frontend and backend
- **Nodemon** for backend auto-restart
- **ESLint** for code linting
- **Prettier** for code formatting

## 📁 Project Structure

```
internship/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── config/          # Database configuration
│   │   └── index.ts         # Entry point
│   ├── dist/                # Compiled JavaScript
│   └── package.json
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utility functions
│   │   └── App.tsx          # Main component
│   ├── public/              # Static assets
│   └── package.json
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd internship
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/servicepro
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5001
```

### 4. Database Setup
Make sure MongoDB is running locally or provide a MongoDB Atlas connection string.

### 5. Run the Application

**Option 1: Run both simultaneously (Recommended)**
```bash
# From the root directory
npm run dev
```

**Option 2: Run separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Service Providers
- `GET /api/service-providers` - Get all service providers
- `GET /api/service-providers/types` - Get service types
- `POST /api/service-providers/register` - Register as service provider

### Bookings
- `POST /api/bookings/book` - Book a service slot
- `GET /api/bookings/:bookingId` - Get booking details
- `GET /api/bookings/user/:userId` - Get user bookings
- `GET /api/bookings/slots` - Get available slots

## 🎯 Usage Guide

### For Customers

1. **Sign Up**: Create an account with your details
2. **Login**: Sign in to access booking features
3. **Book Service**:
   - Select service type (Electrician, Plumber, etc.)
   - Choose a service provider
   - Pick date and time
   - Review your details
   - Confirm booking
4. **View Bookings**: Check "My Bookings" to see all your bookings

### For Service Providers

1. **Sign Up**: Create a customer account first
2. **Become Provider**: 
   - Click "Become Provider"
   - Fill out the registration form
   - Select service type and set rates
   - Choose working days and areas
   - Add skills and bio
3. **Start Receiving Bookings**: Customers can now book your services

## 🏗️ Architecture Decisions

### Frontend Architecture
- **Component-based**: Modular, reusable React components
- **Custom Hooks**: Reusable logic for API calls and state management
- **Context API**: Global state for authentication and notifications
- **TypeScript**: Type safety and better developer experience

### Backend Architecture
- **MVC Pattern**: Clear separation of concerns
- **Middleware Chain**: Authentication, validation, error handling
- **Mongoose ODM**: Object modeling for MongoDB
- **JWT Authentication**: Stateless authentication system

### Database Design
- **User Model**: Handles both customers and service providers
- **ServiceProvider Model**: Extended profile for service providers
- **Booking Model**: Manages service bookings
- **Slot Model**: Time slot management for providers

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Tokens**: Secure authentication with expiration
- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: Protection against brute force attacks
- **CORS Configuration**: Controlled cross-origin access
- **Environment Variables**: Sensitive data protection

## 🎨 UI/UX Design Principles

- **Mobile-First**: Responsive design for all devices
- **Accessibility**: High contrast, clear navigation
- **User-Friendly**: Intuitive interface suitable for all age groups
- **Professional**: Clean, modern design aesthetic
- **Consistent**: Unified design system throughout
- **Feedback**: Clear success/error messages and loading states

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Service provider registration
- [ ] Complete booking flow
- [ ] Booking management
- [ ] Responsive design on different devices
- [ ] Error handling scenarios

## 🚀 Deployment

### Production Build
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Environment Variables for Production
Update environment variables for production:
- Set `NODE_ENV=production`
- Use production MongoDB URI
- Use strong JWT secret
- Configure CORS for production domain

## 📈 Future Enhancements

### Planned Features
- **Payment Integration**: Stripe/Razorpay integration
- **Real-time Chat**: Customer-provider communication
- **Rating System**: Service provider ratings and reviews
- **Push Notifications**: Booking updates and reminders
- **Advanced Search**: Filter by location, price, ratings
- **Service Provider Dashboard**: Analytics and booking management
- **Admin Panel**: Platform management and monitoring

### Technical Improvements
- **Testing Suite**: Unit and integration tests
- **Performance Optimization**: Code splitting and lazy loading
- **PWA Features**: Offline support and app-like experience
- **Monitoring**: Error tracking and performance monitoring
- **CI/CD Pipeline**: Automated deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Developer**: [Your Name]
- **Project Type**: Internship Assignment
- **Technology Stack**: MERN + TypeScript

## 📞 Support

For any questions or issues:
- Email: [your-email@example.com]
- GitHub Issues: [repository-url]/issues

---

**Built with ❤️ using the MERN Stack and TypeScript**# wendor-assignment
