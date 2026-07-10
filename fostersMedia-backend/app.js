import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

import { securityHeaders, corsOptions, rateLimiter } from './middleware/securityMiddleware.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import userAuthRoutes from './routes/userAuthRoutes.js';
import influencerRoutes from './routes/influencerRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import websiteSettingsRoutes from './routes/websiteSettingsRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use(corsOptions);
app.use(securityHeaders);
app.use(rateLimiter);
app.use(morgan('combined'));

app.get('/health', (req, res) => {
  res
    .status(200)
    .json({ success: true, message: 'Fosters Media API is running', timestamp: new Date() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userAuthRoutes);
app.use('/api/v1/influencers', influencerRoutes);
app.use('/api/v1/brands', brandRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/portfolio', portfolioRoutes);
app.use('/api/v1/gallery', galleryRoutes);
app.use('/api/v1/testimonials', testimonialRoutes);
app.use('/api/v1/enquiries', enquiryRoutes);
app.use('/api/v1/settings', websiteSettingsRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
