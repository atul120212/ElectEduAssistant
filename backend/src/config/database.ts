import { PrismaClient } from '@prisma/client';
import { logger } from '../middleware/logger';

export const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'error' },
    { emit: 'stdout', level: 'info' },
    { emit: 'stdout', level: 'warn' },
  ],
});

prisma.$on('query', (e) => {
  logger.debug(`Query: ${e.query}`);
  logger.debug(`Duration: ${e.duration}ms`);
});

export const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info('📦 Connected to PostgreSQL database');
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};
