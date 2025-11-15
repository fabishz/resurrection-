/**
 * RSS Renaissance Backend Server
 * Standalone API server with Fastify
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler } from './utils/error-handler';
import { initializeJobs } from './jobs';

// Import routes
import feedRoutes from './routes/feed.routes';
import articleRoutes from './routes/article.routes';
import summaryRoutes from './routes/summary.routes';
import healthRoutes from './routes/health.routes';

const server = Fastify({
  logger: logger,
  requestIdHeader: 'x-request-id',
  requestIdLogLabel: 'reqId',
  disableRequestLogging: false,
  trustProxy: true,
});

async function start() {
  try {
    // Register plugins
    await server.register(helmet, {
      contentSecurityPolicy: false,
    });

    await server.register(cors, {
      origin: config.cors.origins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    });

    await server.register(rateLimit, {
      max: config.rateLimit.max,
      timeWindow: config.rateLimit.window,
      errorResponseBuilder: () => ({
        success: false,
        error: 'Too many requests, please try again later',
        code: 'RATE_LIMIT_EXCEEDED',
      }),
    });

    // Register error handler
    server.setErrorHandler(errorHandler);

    // Register routes
    await server.register(feedRoutes, { prefix: '/api' });
    await server.register(articleRoutes, { prefix: '/api' });
    await server.register(summaryRoutes, { prefix: '/api' });
    await server.register(healthRoutes);

    // Initialize background jobs
    if (config.env === 'production' || config.env === 'development') {
      initializeJobs();
      logger.info('Background jobs initialized');
    }

    // Start server
    await server.listen({
      port: config.port,
      host: config.host,
    });

    logger.info(`🚀 Server running at http://${config.host}:${config.port}`);
    logger.info(`📝 Environment: ${config.env}`);
    logger.info(`🔒 CORS enabled for: ${config.cors.origins.join(', ')}`);
  } catch (error) {
    logger.error(error, 'Failed to start server');
    process.exit(1);
  }
}

// Graceful shutdown
const signals = ['SIGINT', 'SIGTERM'];
signals.forEach((signal) => {
  process.on(signal, async () => {
    logger.info(`Received ${signal}, closing server gracefully`);
    await server.close();
    process.exit(0);
  });
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error(error, 'Uncaught exception');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ reason, promise }, 'Unhandled rejection');
  process.exit(1);
});

start();
