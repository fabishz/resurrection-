/**
 * Feed Routes - API endpoints for feed management
 */

import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { IngestFeedSchema, PaginationSchema } from '../types/api';
import { FeedIngestionService } from '../services/feed-ingestion';

const feedRoutes: FastifyPluginAsync = async (fastify) => {
  /**
   * POST /api/v1/feeds/ingest
   * Ingest a new RSS/Atom feed
   */
  fastify.post('/ingest', async (request, reply) => {
    const startTime = Date.now();

    try {
      // Validate request body
      const body = IngestFeedSchema.parse(request.body);
      const { url, userId } = body;

      const { database, redis, logger } = request.services;

      // Check if feed already exists
      const existingFeed = await database.getFeedByUrl(url);
      if (existingFeed) {
        return reply.code(409).send({
          success: false,
          error: 'Feed already exists',
          feedId: existingFeed.id,
        });
      }

      // Check cache first
      const cachedFeed = await redis.getCachedFeed(url);
      let parsedFeed;

      if (cachedFeed) {
        logger.info({ url }, 'Using cached feed data');
        parsedFeed = cachedFeed;
      } else {
        // Fetch and parse feed
        const feedService = new FeedIngestionService(logger, {
          userAgent: process.env.FEED_USER_AGENT || 'RSS Renaissance Bot/1.0',
          timeout: parseInt(process.env.FEED_TIMEOUT || '30000'),
          maxRetries: parseInt(process.env.FEED_MAX_RETRIES || '3'),
          retryDelay: parseInt(process.env.FEED_RETRY_DELAY || '2000'),
        });

        parsedFeed = await feedService.ingestFeed(url);

        // Cache the parsed feed
        await redis.cacheFeed(url, parsedFeed, 1800); // 30 minutes
      }

      // Save feed to database
      const feed = await database.createFeed({
        url,
        title: parsedFeed.meta.title,
        description: parsedFeed.meta.description,
        link: parsedFeed.meta.link,
        language: parsedFeed.meta.language,
        copyright: parsedFeed.meta.copyright,
        managingEditor: parsedFeed.meta.managingEditor,
        webMaster: parsedFeed.meta.webMaster,
        pubDate: parsedFeed.meta.pubDate,
        lastBuildDate: parsedFeed.meta.lastBuildDate,
        category: parsedFeed.meta.category,
        generator: parsedFeed.meta.generator,
        docs: parsedFeed.meta.docs,
        cloud: parsedFeed.meta.cloud,
        ttl: parsedFeed.meta.ttl,
        image: parsedFeed.meta.image,
        lastFetched: new Date(),
        fetchCount: 1,
        ...(userId && { userId }),
      });

      // Save articles
      const articles = parsedFeed.items.map((item) => ({
        guid: item.guid,
        title: item.title,
        description: item.description,
        content: item.content,
        link: item.link,
        author: item.author,
        category: item.category,
        comments: item.comments,
        enclosure: item.enclosure,
        pubDate: item.pubDate,
        source: item.source,
        feedId: feed.id,
      }));

      await database.createManyArticles(articles);

      const processingTime = Date.now() - startTime;

      logger.info({
        feedId: feed.id,
        url,
        itemsIngested: articles.length,
        processingTime,
      }, 'Feed ingested successfully');

      return reply.code(201).send({
        success: true,
        feedId: feed.id,
        title: feed.title,
        description: feed.description,
        itemsIngested: articles.length,
        items: parsedFeed.items.slice(0, 10).map((item) => ({
          id: item.guid,
          title: item.title,
          description: item.description,
          link: item.link,
          pubDate: item.pubDate?.toISOString(),
        })),
        processingTime,
      });
    } catch (error) {
      const err = error as Error;
      request.services.logger.error({ error: err.message }, 'Feed ingestion failed');

      if (err.message.includes('Invalid feed URL')) {
        return reply.code(400).send({
          success: false,
          error: err.message,
        });
      }

      return reply.code(500).send({
        success: false,
        error: 'Failed to ingest feed',
        details: err.message,
      });
    }
  });

  /**
   * GET /api/v1/feeds
   * Get all feeds with pagination
   */
  fastify.get('/', async (request, reply) => {
    try {
      const query = PaginationSchema.parse(request.query);
      const { page, limit } = query;

      const { database } = request.services;
      const result = await database.getAllFeeds(page, limit);

      return reply.send({
        success: true,
        data: result.feeds,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: result.pages,
          hasNext: page < result.pages,
          hasPrev: page > 1,
        },
      });
    } catch (error) {
      const err = error as Error;
      request.services.logger.error({ error: err.message }, 'Failed to fetch feeds');

      return reply.code(500).send({
        success: false,
        error: 'Failed to fetch feeds',
      });
    }
  });

  /**
   * GET /api/v1/feeds/:id
   * Get a specific feed by ID
   */
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const { database } = request.services;

      const feed = await database.getFeedById(id);

      if (!feed) {
        return reply.code(404).send({
          success: false,
          error: 'Feed not found',
        });
      }

      return reply.send({
        success: true,
        data: {
          id: feed.id,
          url: feed.url,
          title: feed.title,
          description: feed.description,
          link: feed.link,
          itemCount: feed._count.articles,
          lastFetched: feed.lastFetched?.toISOString(),
          status: feed.status,
          createdAt: feed.createdAt.toISOString(),
          updatedAt: feed.updatedAt.toISOString(),
        },
      });
    } catch (error) {
      const err = error as Error;
      request.services.logger.error({ error: err.message }, 'Failed to fetch feed');

      return reply.code(500).send({
        success: false,
        error: 'Failed to fetch feed',
      });
    }
  });

  /**
   * DELETE /api/v1/feeds/:id
   * Delete a feed and all its articles
   */
  fastify.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const { database, logger } = request.services;

      const feed = await database.getFeedById(id);

      if (!feed) {
        return reply.code(404).send({
          success: false,
          error: 'Feed not found',
        });
      }

      // Delete feed (cascade will delete articles)
      await database.prisma.feed.delete({ where: { id } });

      logger.info({ feedId: id }, 'Feed deleted successfully');

      return reply.send({
        success: true,
        message: 'Feed deleted successfully',
      });
    } catch (error) {
      const err = error as Error;
      request.services.logger.error({ error: err.message }, 'Failed to delete feed');

      return reply.code(500).send({
        success: false,
        error: 'Failed to delete feed',
      });
    }
  });

  /**
   * POST /api/v1/feeds/:id/refresh
   * Manually refresh a feed
   */
  fastify.post('/:id/refresh', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const { database, redis, logger } = request.services;

      const feed = await database.getFeedById(id);

      if (!feed) {
        return reply.code(404).send({
          success: false,
          error: 'Feed not found',
        });
      }

      // Fetch fresh feed data
      const feedService = new FeedIngestionService(logger, {
        userAgent: process.env.FEED_USER_AGENT || 'RSS Renaissance Bot/1.0',
        timeout: parseInt(process.env.FEED_TIMEOUT || '30000'),
        maxRetries: parseInt(process.env.FEED_MAX_RETRIES || '3'),
        retryDelay: parseInt(process.env.FEED_RETRY_DELAY || '2000'),
      });

      const parsedFeed = await feedService.ingestFeed(feed.url);

      // Update feed metadata
      await database.updateFeed(id, {
        lastFetched: new Date(),
        fetchCount: { increment: 1 },
        status: 'ACTIVE',
        lastError: null,
      });

      // Save new articles
      const articles = parsedFeed.items.map((item) => ({
        guid: item.guid,
        title: item.title,
        description: item.description,
        content: item.content,
        link: item.link,
        author: item.author,
        category: item.category,
        comments: item.comments,
        enclosure: item.enclosure,
        pubDate: item.pubDate,
        source: item.source,
        feedId: id,
      }));

      const result = await database.createManyArticles(articles);

      // Update cache
      await redis.cacheFeed(feed.url, parsedFeed, 1800);

      logger.info({ feedId: id, newArticles: result.count }, 'Feed refreshed successfully');

      return reply.send({
        success: true,
        message: 'Feed refreshed successfully',
        newArticles: result.count,
      });
    } catch (error) {
      const err = error as Error;
      request.services.logger.error({ error: err.message }, 'Failed to refresh feed');

      return reply.code(500).send({
        success: false,
        error: 'Failed to refresh feed',
        details: err.message,
      });
    }
  });
};

export default feedRoutes;
