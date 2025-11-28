import { Router } from 'express';
import { login, register, getProfile, updateProfile, changePassword } from '../controllers/authController';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { loginValidation } from '../middleware/validation';

const router = Router();

// Public routes
router.post('/login', loginValidation, login);
router.post('/register', authenticate, authorizeAdmin, register);

// Protected routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);

export default router;
