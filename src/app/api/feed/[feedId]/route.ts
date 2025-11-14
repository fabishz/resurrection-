import { NextRequest, NextResponse } from 'next/server';
import { getFeed, getItemsByFeed } from '@/lib/storage';
import type { ApiError } from '@/types/api';

/**
 * GET /api/feed/[feedId]
 * Get feed details and all its articles
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ feedId: string }> }
) {
  try {
    const { feedId } = await params;

    const feed = getFeed(feedId);

    if (!feed) {
      const error: ApiError = {
        success: false,
        error: 'Feed not found',
        code: 'NOT_FOUND',
      };
      return NextResponse.json(error, { status: 404 });
    }

    const items = getItemsByFeed(feedId);

    return NextResponse.json(
      {
        success: true,
        feed,
        articles: items,
        articleCount: items.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Feed API] Error:', error);

    const apiError: ApiError = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch feed',
      code: 'FETCH_ERROR',
    };

    return NextResponse.json(apiError, { status: 500 });
  }
}
