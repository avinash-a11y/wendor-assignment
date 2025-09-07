import express from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateRegister, validateLogin } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const authController = new AuthController();

// Register new user
router.post('/register', validateRegister, authController.register.bind(authController));

// Login user
router.post('/login', validateLogin, authController.login.bind(authController));

// Get current user profile (protected route)
router.get('/profile', authenticateToken, authController.getProfile.bind(authController));

export default router;
