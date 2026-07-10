import express from 'express';
import {
  loginAdmin,
  registerAdmin,
  logoutAdmin,
  getCurrentAdmin,
  refreshAccessToken,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { loginSchema, registerSchema } from '../validators/authValidator.js';

const router = express.Router();

router.post('/login', validate(loginSchema), loginAdmin);
router.post('/register', validate(registerSchema), registerAdmin);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', protect, logoutAdmin);
router.get('/me', protect, getCurrentAdmin);

export default router;
