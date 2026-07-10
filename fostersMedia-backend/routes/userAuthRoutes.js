import express from 'express';
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  refreshAccessToken,
} from '../controllers/userAuthController.js';
import { validate } from '../middleware/validationMiddleware.js';
import {
  loginSchema,
  userRegisterSchema,
} from '../validators/authValidator.js';

const router = express.Router();

router.post('/login', validate(loginSchema), loginUser);
router.post('/register', validate(userRegisterSchema), registerUser);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', logoutUser);
router.get('/me', getCurrentUser);

export default router;
