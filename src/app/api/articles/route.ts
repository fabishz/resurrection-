import { NextRequest, NextResponse } from 'next/server';
import { getAllItems, getAllFeeds } from '@/lib/storage';
import type { ApiError } from '@/types/api';

/**
 * GET /api/articles
 * Get all articles across all feeds
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const allItems = getAllItems();
    const feeds = getAllFeeds();
    
    // Create a feed lookup map
    const feedMap = new Map(feeds.map(f => [f.id, f]));
    
    // Enrich articles with feed information
    const enrichedArticles = allItems.map((item) => {
      const feed = feedMap.get(item.feedId);
      return {
        ...item,
        feedTitle: feed?.title || 'Unknown Feed',
        feedUrl: feed?.url || '',
      };
    });

    // Apply pagination
    const paginatedArticles = enrichedArticles.slice(offset, offset + limit);

    return NextResponse.json(
      {
        success: true,
        articles: paginatedArticles,
        total: enrichedArticles.length,
        limit,
        offset,
        hasMore: offset + limit < enrichedArticles.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Articles API] Error:', error);

    const apiError: ApiError = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch articles',
      code: 'FETCH_ERROR',
    };

    return NextResponse.json(apiError, { status: 500 });
  }
}
