import winston from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';
import { env } from '../config/environment';

const loggingWinston = new LoggingWinston({
  projectId: env.NODE_ENV === 'production' ? process.env.GCP_PROJECT_ID : undefined,
  logName: 'election-edu-backend',
});

export const logger = winston.createLogger({
  level: env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'election-edu-backend' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // Add Stackdriver Logging in production
    ...(env.NODE_ENV === 'production' ? [loggingWinston] : []),
  ],
});

export const logInfo = (message: string, meta?: any) => {
  logger.info(message, meta);
};

export const logError = (message: string, error?: any) => {
  logger.error(message, { error: error instanceof Error ? error.stack : error });
};

export const logWarn = (message: string, meta?: any) => {
  logger.warn(message, meta);
};
