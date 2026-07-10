import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getDashboardHandler,
  getMonthlyGrowthHandler,
  getRecentActivitiesHandler,
  getNotificationsHandler,
} from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/', protect, getDashboardHandler);
router.get('/growth', protect, getMonthlyGrowthHandler);
router.get('/activities', protect, getRecentActivitiesHandler);
router.get('/notifications', protect, getNotificationsHandler);

export default router;
