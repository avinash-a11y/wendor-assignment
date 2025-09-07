# ServicePro - Complete Setup Guide

## 🚀 Quick Start (5 minutes)

### Prerequisites Check
```bash
node --version    # Should be v16+
npm --version     # Should be v8+
mongod --version  # Should be v5+
```

### One-Command Setup
```bash
# Clone and setup everything
git clone <your-repo-url>
cd internship
npm run install-deps
npm run dev
```

Visit: http://localhost:3000

## 📋 Detailed Setup Instructions

### Step 1: Environment Setup

#### Backend Environment (.env)
Create `backend/.env`:
```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/servicepro

# Security
JWT_SECRET=your-super-secure-jwt-secret-key-here

# CORS
FRONTEND_URL=http://localhost:3000
```

#### Frontend Environment (.env)
Create `frontend/.env`:
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5001

# Development
GENERATE_SOURCEMAP=true
REACT_APP_ENV=development
```

### Step 2: Database Setup

#### Option 1: Local MongoDB
```bash
# Install MongoDB (macOS)
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify connection
mongosh
```

#### Option 2: MongoDB Atlas (Cloud)
1. Go to https://cloud.mongodb.com
2. Create free cluster
3. Get connection string
4. Update `MONGODB_URI` in backend/.env

### Step 3: Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 4: Build & Run

#### Development Mode
```bash
# Run both frontend and backend
npm run dev
```

#### Production Mode
```bash
# Build everything
npm run build

# Start production server
npm start
```

## 🔧 Available Scripts

### Root Level
```bash
npm run dev          # Run both frontend and backend in development
npm run build        # Build both for production
npm run start        # Start production server
npm run install-deps # Install all dependencies
npm run test         # Run tests
npm run lint         # Run linting
```

### Backend Scripts
```bash
cd backend
npm run dev          # Development with nodemon
npm run build        # Compile TypeScript
npm start            # Production server
npm run lint         # ESLint check
```

### Frontend Scripts
```bash
cd frontend
npm start            # Development server
npm run build        # Production build
npm test             # Run tests
npm run lint         # ESLint check
npm run eject        # Eject from Create React App
```

## 🌐 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/health
- **API Documentation**: http://localhost:5001/api

## 📊 Database Seeding (Optional)

### Create Sample Data
```bash
cd backend
node scripts/seed-database.js
```

This creates:
- Sample service providers
- Available time slots
- Service types
- Test users

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 5001
npx kill-port 5001
```

#### MongoDB Connection Failed
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Restart MongoDB
brew services restart mongodb-community
```

#### Node Modules Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Compilation Errors
```bash
cd backend
npm run build
# Check for TypeScript errors
```

### Environment Variables Not Loading
1. Ensure `.env` files exist in correct locations
2. Restart development servers after changes
3. Check for typos in variable names

### CORS Issues
1. Verify `FRONTEND_URL` in backend/.env
2. Check if frontend is running on correct port
3. Clear browser cache

## 🔐 Security Setup

### JWT Secret Generation
```bash
# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Password Requirements
- Minimum 6 characters
- Mix of letters and numbers recommended
- Special characters supported

## 📱 Testing the Application

### Manual Testing Checklist

#### Authentication Flow
- [ ] User registration works
- [ ] Email validation works
- [ ] Login/logout works
- [ ] Protected routes redirect to login

#### Booking Flow
- [ ] Service type selection
- [ ] Provider selection with real data
- [ ] Date/time slot selection
- [ ] Booking confirmation
- [ ] My Bookings shows data

#### Service Provider Flow
- [ ] Become provider registration
- [ ] Form validation works
- [ ] Success/error messages

#### Responsive Design
- [ ] Mobile view (375px)
- [ ] Tablet view (768px)
- [ ] Desktop view (1024px+)

### API Testing with curl
```bash
# Health check
curl http://localhost:5001/health

# Get service types
curl http://localhost:5001/api/service-providers/types

# Register user
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"+1234567890","password":"password123"}'
```

## 🚀 Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/servicepro
JWT_SECRET=production-secret-key
PORT=5001
FRONTEND_URL=https://your-domain.com
```

### Build Commands
```bash
# Create production builds
npm run build

# Start production server
NODE_ENV=production npm start
```

### Deployment Platforms

#### Vercel (Frontend)
```bash
cd frontend
vercel --prod
```

#### Heroku (Backend)
```bash
cd backend
heroku create servicepro-api
git push heroku main
```

#### Railway (Full Stack)
```bash
railway login
railway init
railway up
```

## 📈 Performance Optimization

### Development
- Use React Developer Tools
- Monitor bundle size with `npm run analyze`
- Check API response times

### Production
- Enable gzip compression
- Use CDN for static assets
- Implement caching strategies
- Monitor with analytics

## 🤝 Development Workflow

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/booking-flow

# Make changes and commit
git add .
git commit -m "feat: implement booking flow"

# Push and create PR
git push origin feature/booking-flow
```

### Code Quality
```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests
npm test
```

## 📞 Support

### Getting Help
1. Check this setup guide
2. Review error messages carefully
3. Check browser console for frontend issues
4. Check terminal output for backend issues
5. Verify environment variables

### Common Commands Reference
```bash
# Project setup
npm run install-deps
npm run dev

# Debugging
npm run lint
npm test
npm run build

# Database
mongosh
show dbs
use servicepro
show collections
```

---

**Need help?** Create an issue in the repository or contact the development team.
