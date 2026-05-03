import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import hpp from 'hpp';
const xss = require('xss-clean');
import { env } from './config/environment';
import { connectDB } from './config/database';
import { logger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import { globalLimiter } from './middleware/rateLimiter';

const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://*.googleapis.com"],
    },
  },
}));
app.use(xss());
app.use(hpp());
app.use(compression());
app.use(cors({ 
  origin: env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(globalLimiter);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
import userRoutes from './routes/user.routes';
import chatRoutes from './routes/chat.routes';
import quizRoutes from './routes/quiz.routes';
import timelineRoutes from './routes/timeline.routes';
import topicsRoutes from './routes/topics.routes';

app.use(`/${env.API_VERSION}/users`, userRoutes);
app.use(`/${env.API_VERSION}/chat`, chatRoutes);
app.use(`/${env.API_VERSION}/quiz`, quizRoutes);
app.use(`/${env.API_VERSION}/timeline`, timelineRoutes);
app.use(`/${env.API_VERSION}/topics`, topicsRoutes);

// Error Handling
app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  
  app.listen(env.PORT, () => {
    logger.info(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received. Shutting down gracefully');
  process.exit(0);
});
