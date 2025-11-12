import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { summarize } from '@/lib/summarizer';
import { getItem } from '@/lib/storage';
import { normalizeContent } from '@/lib/feed-parser';
import type { SummarizeRequest, SummarizeResponse, ApiError } from '@/types/api';

// Request validation schema
const SummarizeRequestSchema = z.object({
  articleId: z.string().optional(),
  content: z.string().optional(),
  title: z.string().optional(),
  maxLength: z.number().min(50).max(1000).optional().default(200),
});

/**
 * POST /api/summarize
 * Summarize article content using AI
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Parse and validate request body
    const body: SummarizeRequest = await request.json();

    const validation = SummarizeRequestSchema.safeParse(body);
    if (!validation.success) {
      const error: ApiError = {
        success: false,
        error: 'Invalid request body',
        code: 'VALIDATION_ERROR',
        details: validation.error.errors,
      };
      return NextResponse.json(error, { status: 400 });
    }

    const { articleId, content, title, maxLength } = validation.data;

    // Must provide either articleId or content
    if (!articleId && !content) {
      const error: ApiError = {
        success: false,
        error: 'Either articleId or content must be provided',
        code: 'MISSING_PARAMETER',
      };
      return NextResponse.json(error, { status: 400 });
    }

    let articleContent = content;
    let articleTitle = title;

    // If articleId provided, fetch from storage
    if (articleId) {
      const item = getItem(articleId);

      if (!item) {
        const error: ApiError = {
          success: false,
          error: 'Article not found',
          code: 'NOT_FOUND',
        };
        return NextResponse.json(error, { status: 404 });
      }

      articleContent = item.content || item.contentSnippet;
      articleTitle = item.title;
    }

    if (!articleContent) {
      const error: ApiError = {
        success: false,
        error: 'No content available to summarize',
        code: 'NO_CONTENT',
      };
      return NextResponse.json(error, { status: 400 });
    }

    console.log(`[Summarize] Summarizing ${articleId ? `article ${articleId}` : 'provided content'}`);

    // Normalize content (remove HTML, extra whitespace)
    const normalizedContent = normalizeContent(articleContent);

    // Check content length
    if (normalizedContent.length < 50) {
      const error: ApiError = {
        success: false,
        error: 'Content too short to summarize (minimum 50 characters)',
        code: 'CONTENT_TOO_SHORT',
      };
      return NextResponse.json(error, { status: 400 });
    }

    // Summarize using MCP (or mock) with caching and rate limiting
    const result = await summarize(normalizedContent, articleTitle, {
      maxLength,
      extractKeyPoints: true,
      analyzeSentiment: true,
      categorize: true,
    });

    console.log(`[Summarize] Generated summary in ${result.processingTime}ms`);

    // Return response
    const response: SummarizeResponse = {
      success: true,
      summary: result.summary,
      keyPoints: result.keyPoints,
      sentiment: result.sentiment,
      categories: result.categories,
      processingTime: Date.now() - startTime,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('[Summarize] Error:', error);

    const apiError: ApiError = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to summarize content',
      code: 'SUMMARIZE_ERROR',
    };

    return NextResponse.json(apiError, { status: 500 });
  }
}

/**
 * GET /api/summarize?articleId=xxx
 * Get cached summary for article (if available)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('articleId');

    if (!articleId) {
      const error: ApiError = {
        success: false,
        error: 'articleId parameter is required',
        code: 'MISSING_PARAMETER',
      };
      return NextResponse.json(error, { status: 400 });
    }

    const item = getItem(articleId);

    if (!item) {
      const error: ApiError = {
        success: false,
        error: 'Article not found',
        code: 'NOT_FOUND',
      };
      return NextResponse.json(error, { status: 404 });
    }

    // TODO: Check Redis cache for existing summary
    // For now, return article info
    return NextResponse.json(
      {
        success: true,
        article: {
          id: item.id,
          title: item.title,
          hasContent: !!item.content,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Summarize] Error:', error);

    const apiError: ApiError = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get summary',
      code: 'GET_ERROR',
    };

    return NextResponse.json(apiError, { status: 500 });
  }
}
