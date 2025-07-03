import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define human-readable format for console
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  winston.format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${message} ${stack ? '\n' + stack : ''}`;
  })
);

// Define JSON format for log files
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create the logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transports: [
    // Write logs to console in human-readable format
    new winston.transports.Console({
      format: consoleFormat
    }),
    // Write all logs to application.json in JSON format
    new winston.transports.File({ 
      filename: path.join(logsDir, 'application.json'),
      format: fileFormat,
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
    // Write error logs to error.json in JSON format
    new winston.transports.File({ 
      filename: path.join(logsDir, 'error.json'), 
      level: 'error',
      format: fileFormat,
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    })
  ]
});

export default logger;
