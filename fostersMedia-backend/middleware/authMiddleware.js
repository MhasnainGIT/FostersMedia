import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id).select('-password');
    if (admin) {
      req.user = admin;
      req.userType = 'admin';
      return next();
    }

    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = user;
      req.userType = 'user';
      return next();
    }

    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.name === 'JsonWebTokenError' ? 'Invalid token' : 'Token expired',
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this route',
      });
    }
    next();
  };
};

export const verifyRefreshToken = (refreshToken) => {
  return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
};

export const generateTokens = (userId) => {
  const payload = { id: userId };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
  return { accessToken, refreshToken };
};
