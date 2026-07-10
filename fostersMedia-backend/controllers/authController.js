import jwt from 'jsonwebtoken';
import { successResponse } from '../utils/response.js';
import {
  login,
  register,
  logout,
  getMe,
  refreshToken as refreshTokenService,
} from '../services/authService.js';

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    successResponse(res, 'Login successful', {
      admin: result.admin,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const registerAdmin = async (req, res, next) => {
  try {
    const admin = await register(req.body);
    successResponse(res, 'Admin registered successfully', admin, 201);
  } catch (error) {
    next(error);
  }
};

export const logoutAdmin = async (req, res, next) => {
  try {
    await logout(req.user.id);
    successResponse(res, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

export const getCurrentAdmin = async (req, res, next) => {
  try {
    const admin = await getMe(req.user.id);
    successResponse(res, 'Admin fetched successfully', admin);
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const result = await refreshTokenService(decoded.id);
    successResponse(res, 'Token refreshed successfully', {
      admin: result.admin,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};
