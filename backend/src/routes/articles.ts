/**
 * Article Routes - API endpoints for article management
 */

import { FastifyPluginAsync } from 'fastify';
import { PaginationSchema } from '../types/api';

const articleRoutes: FastifyPluginAsync = async (fastify) => {
  /**
   * GET /api/v1/articles
   * Get all articles with pagination and optional feed filter
   */
  fastify.get('/', async (request, reply) => {
    try {
      const query = PaginationSchema.parse(request.query);
      const { page, limit } = query;
      const { feedId } = request.query as { feedId?: string };

      const { database } = request.services;
      const result = await database.getAllArticles(page, limit, feedId);

      return reply.send({
        success: true,
        data: result.articles,
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
      request.services.logger.error({ error: err.message }, 'Failed to fetch articles');

      return reply.code(500).send({
        success: false,
        error: 'Failed to fetch articles',
      });
    }
  });

  /**
   * GET /api/v1/articles/:id
   * Get a specific article by ID
   */
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const { database } = request.services;

      const article = await database.getArticleById(id);

      if (!article) {
        return reply.code(404).send({
          success: false,
          error: 'Article not found',
        });
      }

      return reply.send({
        success: true,
        data: {
          id: article.id,
          title: article.title,
          description: article.description,
          content: article.content,
          link: article.link,
          author: article.author,
          category: article.category,
          pubDate: article.pubDate?.toISOString(),
          feedId: article.feedId,
          feedTitle: article.feed.title,
          isRead: article.isRead,
          isBookmarked: article.isBookmarked,
          isArchived: article.isArchived,
          summary: article.summaries[0] ? {
            id: article.summaries[0].id,
            content: article.summaries[0].content,
            keyPoints: article.summaries[0].keyPoints,
            sentiment: article.summaries[0].sentiment,
            categories: article.summaries[0].categories,
            createdAt: article.summaries[0].createdAt.toISOString(),
          } : null,
          createdAt: article.createdAt.toISOString(),
        },
      });
    } catch (error) {
      const err = error as Error;
      request.services.logger.error({ error: err.message }, 'Failed to fetch article');

      return reply.code(500).send({
        success: false,
        error: 'Failed to fetch article',
      });
    }
  });

  /**
   * PATCH /api/v1/articles/:id
   * Update article metadata (read status, bookmark, etc.)
   */
  fastify.patch('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const body = request.body as {
        isRead?: boolean;
        isBookmarked?: boolean;
        isArchived?: boolean;
      };

      const { database, logger } = request.services;

      const article = await database.getArticleById(id);

      if (!article) {
        return reply.code(404).send({
          success: false,
          error: 'Article not found',
        });
      }

      // Update article
      await database.prisma.article.update({
        where: { id },
        data: {
          ...(body.isRead !== undefined && { isRead: body.isRead }),
          ...(body.isBookmarked !== undefined && { isBookmarked: body.isBookmarked }),
          ...(body.isArchived !== undefined && { isArchived: body.isArchived }),
        },
      });

      logger.info({ articleId: id, updates: body }, 'Article updated successfully');

      return reply.send({
        success: true,
        message: 'Article updated successfully',
      });
    } catch (error) {
      const err = error as Error;
      request.services.logger.error({ error: err.message }, 'Failed to update article');

      return reply.code(500).send({
        success: false,
        error: 'Failed to update article',
      });
    }
  });

  /**
   * DELETE /api/v1/articles/:id
   * Delete an article
   */
  fastify.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const { database, logger } = request.services;

      const article = await database.getArticleById(id);

      if (!article) {
        return reply.code(404).send({
          success: false,
          error: 'Article not found',
        });
      }

      await database.prisma.article.delete({ where: { id } });

      logger.info({ articleId: id }, 'Article deleted successfully');

      return reply.send({
        success: true,
        message: 'Article deleted successfully',
      });
    } catch (error) {
      const err = error as Error;
      request.services.logger.error({ error: err.message }, 'Failed to delete article');

      return reply.code(500).send({
        success: false,
        error: 'Failed to delete article',
      });
    }
  });
};

export default articleRoutes;
