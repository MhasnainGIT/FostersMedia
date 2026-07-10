import jwt from 'jsonwebtoken';
import { successResponse } from '../utils/response.js';
import {
  login,
  register,
  logout,
  getMe,
  refreshToken as refreshTokenService,
} from '../services/userAuthService.js';

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    successResponse(res, 'Login successful', {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (req, res, next) => {
  try {
    const user = await register(req.body);
    successResponse(res, 'User registered successfully', user, 201);
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    await logout(req.user.id);
    successResponse(res, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await getMe(req.user.id);
    successResponse(res, 'User fetched successfully', user);
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
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};
