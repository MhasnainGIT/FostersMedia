import { successResponse } from '../utils/response.js';
import {
  getDashboardStats,
  getMonthlyGrowth,
  getRecentActivities,
  getNotifications,
} from '../services/dashboardService.js';

export const getDashboardHandler = async (req, res, next) => {
  try {
    const stats = await getDashboardStats();
    successResponse(res, 'Dashboard stats fetched successfully', stats);
  } catch (error) {
    next(error);
  }
};

export const getMonthlyGrowthHandler = async (req, res, next) => {
  try {
    const growth = await getMonthlyGrowth();
    successResponse(res, 'Monthly growth fetched successfully', growth);
  } catch (error) {
    next(error);
  }
};

export const getRecentActivitiesHandler = async (req, res, next) => {
  try {
    const activities = await getRecentActivities();
    successResponse(res, 'Recent activities fetched successfully', activities);
  } catch (error) {
    next(error);
  }
};

export const getNotificationsHandler = async (req, res, next) => {
  try {
    const notifications = await getNotifications();
    successResponse(res, 'Notifications fetched successfully', notifications);
  } catch (error) {
    next(error);
  }
};
