/**
 * Health Routes - API endpoints for health checks and monitoring
 */

import { FastifyPluginAsync } from 'fastify';
import { AISummarizationService } from '../services/ai-summarization';

const healthRoutes: FastifyPluginAsync = async (fastify) => {
  /**
   * GET /health
   * Basic health check
   */
  fastify.get('/', async (request, reply) => {
    return reply.send({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.API_VERSION || 'v1',
    });
  });

  /**
   * GET /health/detailed
   * Detailed health check with service status
   */
  fastify.get('/detailed', async (request, reply) => {
    const { database, redis, logger } = request.services;

    try {
      // Check database
      let dbStatus: 'connected' | 'disconnected' | 'error' = 'disconnected';
      try {
        await database.prisma.$queryRaw`SELECT 1`;
        dbStatus = 'connected';
      } catch (error) {
        logger.error({ error }, 'Database health check failed');
        dbStatus = 'error';
      }

      // Check Redis
      let redisStatus: 'connected' | 'disconnected' | 'error' = 'disconnected';
      try {
        const isConnected = await redis.ping();
        redisStatus = isConnected ? 'connected' : 'disconnected';
      } catch (error) {
        logger.error({ error }, 'Redis health check failed');
        redisStatus = 'error';
      }

      // Check OpenAI
      let openaiStatus: 'available' | 'unavailable' | 'error' = 'unavailable';
      try {
        const aiService = new AISummarizationService(logger, {
          apiKey: process.env.OPENAI_API_KEY || '',
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '500'),
          temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.3'),
        });
        const isAvailable = await aiService.healthCheck();
        openaiStatus = isAvailable ? 'available' : 'unavailable';
      } catch (error) {
        logger.error({ error }, 'OpenAI health check failed');
        openaiStatus = 'error';
      }

      // Get metrics
      let metrics;
      try {
        const dbMetrics = await database.getHealthMetrics();
        metrics = {
          ...dbMetrics,
          memoryUsage: process.memoryUsage(),
        };
      } catch (error) {
        logger.error({ error }, 'Failed to get metrics');
      }

      const overallStatus = 
        dbStatus === 'connected' && redisStatus === 'connected' 
          ? 'healthy' 
          : 'unhealthy';

      return reply.send({
        status: overallStatus,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.API_VERSION || 'v1',
        services: {
          database: dbStatus,
          redis: redisStatus,
          openai: openaiStatus,
        },
        metrics,
      });
    } catch (error) {
      const err = error as Error;
      logger.error({ error: err.message }, 'Health check failed');

      return reply.code(503).send({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: err.message,
      });
    }
  });

  /**
   * GET /health/ready
   * Readiness probe for Kubernetes/Docker
   */
  fastify.get('/ready', async (request, reply) => {
    const { database, redis } = request.services;

    try {
      // Check critical services
      await database.prisma.$queryRaw`SELECT 1`;
      await redis.ping();

      return reply.send({
        ready: true,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return reply.code(503).send({
        ready: false,
        timestamp: new Date().toISOString(),
      });
    }
  });

  /**
   * GET /health/live
   * Liveness probe for Kubernetes/Docker
   */
  fastify.get('/live', async (request, reply) => {
    return reply.send({
      alive: true,
      timestamp: new Date().toISOString(),
    });
  });
};

export default healthRoutes;
