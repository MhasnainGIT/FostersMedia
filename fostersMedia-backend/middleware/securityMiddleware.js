import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';

export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const securityHeaders = helmet();

export const corsOptions = cors({
  origin: process.env.NODE_ENV === 'development' ? '*' : process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
  optionsSuccessStatus: 200,
});
