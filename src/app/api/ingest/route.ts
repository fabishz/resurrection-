import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchFeed, validateFeedUrl } from '@/lib/feed-parser';
import { storeFeed, storeItems, getFeed } from '@/lib/storage';
import type { IngestRequest, IngestResponse, ApiError } from '@/types/api';

// Request validation schema
const IngestRequestSchema = z.object({
  feedUrl: z.string().url('Invalid feed URL'),
  userId: z.string().optional(),
});

/**
 * POST /api/ingest
 * Ingest RSS feed and store items
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body: IngestRequest = await request.json();

    const validation = IngestRequestSchema.safeParse(body);
    if (!validation.success) {
      const error: ApiError = {
        success: false,
        error: 'Invalid request body',
        code: 'VALIDATION_ERROR',
        details: validation.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      };
      return NextResponse.json(error, { status: 400 });
    }

    const { feedUrl, userId } = validation.data;

    // Additional URL validation
    const urlValidation = validateFeedUrl(feedUrl);
    if (!urlValidation.valid) {
      const error: ApiError = {
        success: false,
        error: urlValidation.error || 'Invalid feed URL',
        code: 'INVALID_URL',
      };
      return NextResponse.json(error, { status: 400 });
    }

    console.log(`[Ingest] Fetching feed: ${feedUrl}`);

    // Fetch and parse feed
    const { feed, items } = await fetchFeed(feedUrl);

    console.log(`[Ingest] Fetched ${items.length} items from ${feed.title}`);

    // Store feed and items
    storeFeed(feed);
    storeItems(items);

    console.log(`[Ingest] Stored feed ${feed.id} with ${items.length} items`);

    // Return response
    const response: IngestResponse = {
      success: true,
      feedId: feed.id,
      itemsIngested: items.length,
      items: items.slice(0, 10), // Return first 10 items
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('[Ingest] Error:', error);

    const apiError: ApiError = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to ingest feed',
      code: 'INGEST_ERROR',
    };

    return NextResponse.json(apiError, { status: 500 });
  }
}

/**
 * GET /api/ingest?feedId=xxx
 * Get feed details and items
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const feedId = searchParams.get('feedId');

    if (!feedId) {
      const error: ApiError = {
        success: false,
        error: 'feedId parameter is required',
        code: 'MISSING_PARAMETER',
      };
      return NextResponse.json(error, { status: 400 });
    }

    const feed = getFeed(feedId);

    if (!feed) {
      const error: ApiError = {
        success: false,
        error: 'Feed not found',
        code: 'NOT_FOUND',
      };
      return NextResponse.json(error, { status: 404 });
    }

    return NextResponse.json({ success: true, feed }, { status: 200 });
  } catch (error) {
    console.error('[Ingest] Error:', error);

    const apiError: ApiError = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get feed',
      code: 'GET_ERROR',
    };

    return NextResponse.json(apiError, { status: 500 });
  }
}
