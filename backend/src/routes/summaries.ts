/**
 * Summary Routes - API endpoints for AI summarization
 */

import { FastifyPluginAsync } from 'fastify';
import { SummarizeSchema } from '../types/api';
import { AISummarizationService } from '../services/ai-summarization';

const summaryRoutes: FastifyPluginAsync = async (fastify) => {
  /**
   * POST /api/v1/summaries/generate
   * Generate AI summary for an article
   */
  fastify.post('/generate', async (request, reply) => {
    try {
      const body = SummarizeSchema.parse(request.body);
      const { articleId, force } = body;

      const { database, redis, logger } = request.services;

      // Get article
      const article = await database.getArticleById(articleId);

      if (!article) {
        return reply.code(404).send({
          success: false,
          error: 'Article not found',
        });
      }

      // Check if summary already exists (unless force is true)
      if (!force) {
        const existingSummary = await database.getSummaryByArticleId(articleId);
        if (existingSummary) {
          return reply.send({
            success: true,
            data: {
              id: existingSummary.id,
              content: existingSummary.content,
              keyPoints: existingSummary.keyPoints,
              sentiment: existingSummary.sentiment,
              categories: existingSummary.categories,
              confidence: existingSummary.confidence,
              model: existingSummary.model,
              processingTime: existingSummary.processingTime,
              createdAt: existingSummary.createdAt.toISOString(),
            },
            cached: true,
          });
        }

        // Check Redis cache
        const cachedSummary = await redis.getCachedSummary(articleId);
        if (cachedSummary) {
          logger.info({ articleId }, 'Using cached summary');
          return reply.send({
            success: true,
            data: cachedSummary,
            cached: true,
          });
        }
      }

      // Generate new summary
      const aiService = new AISummarizationService(logger, {
        apiKey: process.env.OPENAI_API_KEY || '',
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '500'),
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.3'),
      });

      const summary = await aiService.summarizeArticle({
        title: article.title,
        description: article.description || undefined,
        content: article.content || undefined,
      });

      // Save to database
      const savedSummary = await database.createSummary({
        content: summary.content,
        keyPoints: summary.keyPoints,
        sentiment: summary.sentiment,
        categories: summary.categories,
        confidence: summary.confidence,
        model: summary.model,
        tokens: summary.tokens,
        processingTime: summary.processingTime,
        cost: summary.cost,
        article: {
          connect: { id: articleId },
        },
      });

      // Cache the summary
      const summaryResponse = {
        id: savedSummary.id,
        content: savedSummary.content,
        keyPoints: savedSummary.keyPoints,
        sentiment: savedSummary.sentiment,
        categories: savedSummary.categories,
        confidence: savedSummary.confidence,
        model: savedSummary.model,
        processingTime: savedSummary.processingTime,
        createdAt: savedSummary.createdAt.toISOString(),
      };

      await redis.cacheSummary(articleId, summaryResponse, 86400); // 24 hours

      logger.info({
        articleId,
        summaryId: savedSummary.id,
        processingTime: summary.processingTime,
        cost: summary.cost,
      }, 'Summary generated and saved');

      return reply.code(201).send({
        success: true,
        data: summaryResponse,
        cached: false,
      });
    } catch (error) {
      const err = error as Error;
      request.services.logger.error({ error: err.message }, 'Failed to generate summary');

      if (err.message.includes('Article not found')) {
        return reply.code(404).send({
          success: false,
          error: err.message,
        });
      }

      return reply.code(500).send({
        success: false,
        error: 'Failed to generate summary',
        details: err.message,
      });
    }
  });

  /**
   * GET /api/v1/summaries/:articleId
   * Get summary for a specific article
   */
  fastify.get('/:articleId', async (request, reply) => {
    try {
      const { articleId } = request.params as { articleId: string };
      const { database, redis } = request.services;

      // Check cache first
      const cachedSummary = await redis.getCachedSummary(articleId);
      if (cachedSummary) {
        return reply.send({
          success: true,
          data: cachedSummary,
          cached: true,
        });
      }

      // Get from database
      const summary = await database.getSummaryByArticleId(articleId);

      if (!summary) {
        return reply.code(404).send({
          success: false,
          error: 'Summary not found',
        });
      }

      const summaryResponse = {
        id: summary.id,
        content: summary.content,
        keyPoints: summary.keyPoints,
        sentiment: summary.sentiment,
        categories: summary.categories,
        confidence: summary.confidence,
        model: summary.model,
        processingTime: summary.processingTime,
        createdAt: summary.createdAt.toISOString(),
      };

      // Cache for future requests
      await redis.cacheSummary(articleId, summaryResponse, 86400);

      return reply.send({
        success: true,
        data: summaryResponse,
        cached: false,
      });
    } catch (error) {
      const err = error as Error;
      request.services.logger.error({ error: err.message }, 'Failed to fetch summary');

      return reply.code(500).send({
        success: false,
        error: 'Failed to fetch summary',
      });
    }
  });

  /**
   * POST /api/v1/summaries/batch
   * Generate summaries for multiple articles
   */
  fastify.post('/batch', async (request, reply) => {
    try {
      const body = request.body as { articleIds: string[] };
      const { articleIds } = body;

      if (!Array.isArray(articleIds) || articleIds.length === 0) {
        return reply.code(400).send({
          success: false,
          error: 'articleIds must be a non-empty array',
        });
      }

      if (articleIds.length > 10) {
        return reply.code(400).send({
          success: false,
          error: 'Maximum 10 articles per batch',
        });
      }

      const { database, redis, logger } = request.services;

      // Get all articles
      const articles = await Promise.all(
        articleIds.map((id) => database.getArticleById(id))
      );

      const validArticles = articles.filter((a) => a !== null);

      if (validArticles.length === 0) {
        return reply.code(404).send({
          success: false,
          error: 'No valid articles found',
        });
      }

      // Generate summaries
      const aiService = new AISummarizationService(logger, {
        apiKey: process.env.OPENAI_API_KEY || '',
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '500'),
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.3'),
      });

      const summaries = await aiService.summarizeBatch(
        validArticles.map((a) => ({
          id: a!.id,
          title: a!.title,
          description: a!.description || undefined,
          content: a!.content || undefined,
        }))
      );

      // Save summaries
      const results = [];
      for (const [articleId, summary] of summaries.entries()) {
        const savedSummary = await database.createSummary({
          content: summary.content,
          keyPoints: summary.keyPoints,
          sentiment: summary.sentiment,
          categories: summary.categories,
          confidence: summary.confidence,
          model: summary.model,
          tokens: summary.tokens,
          processingTime: summary.processingTime,
          cost: summary.cost,
          article: {
            connect: { id: articleId },
          },
        });

        const summaryResponse = {
          id: savedSummary.id,
          articleId,
          content: savedSummary.content,
          keyPoints: savedSummary.keyPoints,
          sentiment: savedSummary.sentiment,
          categories: savedSummary.categories,
          createdAt: savedSummary.createdAt.toISOString(),
        };

        await redis.cacheSummary(articleId, summaryResponse, 86400);
        results.push(summaryResponse);
      }

      logger.info({
        count: results.length,
        articleIds,
      }, 'Batch summaries generated');

      return reply.code(201).send({
        success: true,
        data: results,
        count: results.length,
      });
    } catch (error) {
      const err = error as Error;
      request.services.logger.error({ error: err.message }, 'Failed to generate batch summaries');

      return reply.code(500).send({
        success: false,
        error: 'Failed to generate batch summaries',
        details: err.message,
      });
    }
  });
};

export default summaryRoutes;
