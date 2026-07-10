import Admin from '../models/Admin.js';
import { generateTokens } from '../middleware/authMiddleware.js';
import { AppError } from '../middleware/errorMiddleware.js';

export const login = async (email, password) => {
  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin || !(await admin.correctPassword(password, admin.password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const { accessToken, refreshToken } = generateTokens(admin._id);
  admin.refreshToken = refreshToken;
  await admin.save();

  admin.password = undefined;
  admin.refreshToken = undefined;

  return { admin, accessToken, refreshToken };
};

export const register = async (data) => {
  const admin = await Admin.create(data);
  admin.password = undefined;
  return admin;
};

export const logout = async (userId) => {
  await Admin.findByIdAndUpdate(userId, { refreshToken: null });
};

export const getMe = async (userId) => {
  return await Admin.findById(userId);
};

export const refreshToken = async (userId) => {
  const admin = await Admin.findById(userId).select('+refreshToken');
  if (!admin) throw new AppError('Admin not found', 404);

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(admin._id);
  admin.refreshToken = newRefreshToken;
  await admin.save();

  admin.refreshToken = undefined;
  return { admin, accessToken, refreshToken: newRefreshToken };
};
