import { NextRequest, NextResponse } from 'next/server';
import { getAllFeeds, getItemsByFeed } from '@/lib/storage';
import type { ApiError } from '@/types/api';

/**
 * GET /api/feeds
 * Get all feeds with their item counts
 */
export async function GET(request: NextRequest) {
  try {
    const feeds = getAllFeeds();
    
    // Enrich feeds with item counts and latest article info
    const enrichedFeeds = feeds.map((feed) => {
      const items = getItemsByFeed(feed.id);
      return {
        ...feed,
        itemCount: items.length,
        latestArticle: items[0]?.title || null,
        latestArticleDate: items[0]?.pubDate || null,
      };
    });

    return NextResponse.json(
      {
        success: true,
        feeds: enrichedFeeds,
        totalFeeds: enrichedFeeds.length,
        totalArticles: enrichedFeeds.reduce((sum, f) => sum + f.itemCount, 0),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Feeds API] Error:', error);

    const apiError: ApiError = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch feeds',
      code: 'FETCH_ERROR',
    };

    return NextResponse.json(apiError, { status: 500 });
  }
}
