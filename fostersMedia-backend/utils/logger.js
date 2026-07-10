import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize(),
  winston.format.printf(({ level, message, timestamp, stack }) => {
    return stack
      ? `${timestamp} ${level}: ${message} - ${stack}`
      : `${timestamp} ${level}: ${message}`;
  })
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'fosters-media-backend' },
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '..', process.env.LOG_FILE_PATH || './logs/app.log'),
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.Console({ format: consoleFormat }),
  ],
});

export default logger;
