import http from 'http';
import dotenv from 'dotenv';
import connectDB from './database/index.js';
import app from './app.js';
import logger from './utils/logger.js';

dotenv.config();

const BASE_PORT = Number(process.env.PORT) || 3000;
const MAX_PORT_RETRIES = 5;

const startServer = (port, retriesLeft) => {
  const server = http.createServer(app);

  server.listen(port, async () => {
    await connectDB();

    // Dev-only: ensure a default admin exists for local development
    try {
      if (process.env.NODE_ENV !== 'production') {
        const Admin = (await import('./models/Admin.js')).default;
        const count = await Admin.countDocuments();
        if (count === 0) {
          await Admin.create({ name: 'Default Admin', email: 'admin@fostersmedia.com', password: 'password123' });
          logger.info('Created default admin (admin@fostersmedia.com / password123) for development');
        }
      }
    } catch (err) {
      logger.warn('Failed to ensure default admin:', err);
    }

    logger.info(`Server running on port ${port} in ${process.env.NODE_ENV} mode`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && retriesLeft > 0) {
      logger.warn(`Port ${port} is in use. Trying port ${port + 1}...`);
      startServer(port + 1, retriesLeft - 1);
      return;
    }

    logger.error(`Server error: ${error.message}`);
    process.exit(1);
  });
};

startServer(BASE_PORT, MAX_PORT_RETRIES);
