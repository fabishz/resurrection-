import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST, GET } from '@/app/api/ingest/route';
import { clearAll, storeFeed, storeItems } from '@/lib/storage';
import { NextRequest } from 'next/server';

// Mock the feed parser
vi.mock('@/lib/feed-parser', () => ({
  fetchFeed: vi.fn(),
  validateFeedUrl: vi.fn(),
}));

import { fetchFeed, validateFeedUrl } from '@/lib/feed-parser';

describe('POST /api/ingest', () => {
  beforeEach(() => {
    clearAll();
    vi.clearAllMocks();
  });

  it('should ingest a valid RSS feed', async () => {
    const mockFeed = {
      id: 'test-feed-id',
      url: 'https://example.com/feed.xml',
      title: 'Test Feed',
      description: 'A test feed',
      link: 'https://example.com',
      lastFetched: new Date().toISOString(),
      itemCount: 2,
    };

    const mockItems = [
      {
        id: 'item-1',
        feedId: 'test-feed-id',
        title: 'Test Article 1',
        link: 'https://example.com/article1',
        content: 'Article 1 content',
        contentSnippet: 'Article 1 snippet',
        pubDate: new Date().toISOString(),
      },
      {
        id: 'item-2',
        feedId: 'test-feed-id',
        title: 'Test Article 2',
        link: 'https://example.com/article2',
        content: 'Article 2 content',
        contentSnippet: 'Article 2 snippet',
        pubDate: new Date().toISOString(),
      },
    ];

    vi.mocked(validateFeedUrl).mockReturnValue({ valid: true });
    vi.mocked(fetchFeed).mockResolvedValue({ feed: mockFeed, items: mockItems });

    const request = new NextRequest('http://localhost:3000/api/ingest', {
      method: 'POST',
      body: JSON.stringify({ feedUrl: 'https://example.com/feed.xml' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.feedId).toBe('test-feed-id');
    expect(data.itemsIngested).toBe(2);
    expect(data.items).toHaveLength(2);
  });

  it('should reject invalid feed URLs', async () => {
    vi.mocked(validateFeedUrl).mockReturnValue({
      valid: false,
      error: 'Invalid URL format',
    });

    const request = new NextRequest('http://localhost:3000/api/ingest', {
      method: 'POST',
      body: JSON.stringify({ feedUrl: 'not-a-valid-url' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Invalid');
  });

  it('should handle feed fetch errors', async () => {
    vi.mocked(validateFeedUrl).mockReturnValue({ valid: true });
    vi.mocked(fetchFeed).mockRejectedValue(new Error('Network error'));

    const request = new NextRequest('http://localhost:3000/api/ingest', {
      method: 'POST',
      body: JSON.stringify({ feedUrl: 'https://example.com/feed.xml' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Network error');
  });

  it('should validate request body', async () => {
    const request = new NextRequest('http://localhost:3000/api/ingest', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.code).toBe('VALIDATION_ERROR');
  });

  it('should return feed metadata and items', async () => {
    const mockFeed = {
      id: 'test-feed-id',
      url: 'https://example.com/feed.xml',
      title: 'Test Feed',
      description: 'A test feed',
      link: 'https://example.com',
      lastFetched: new Date().toISOString(),
      itemCount: 1,
    };

    const mockItems = [
      {
        id: 'item-1',
        feedId: 'test-feed-id',
        title: 'Test Article',
        link: 'https://example.com/article',
        content: 'Article content',
        contentSnippet: 'Article snippet',
        pubDate: new Date().toISOString(),
        author: 'Test Author',
        categories: ['Tech'],
      },
    ];

    vi.mocked(validateFeedUrl).mockReturnValue({ valid: true });
    vi.mocked(fetchFeed).mockResolvedValue({ feed: mockFeed, items: mockItems });

    const request = new NextRequest('http://localhost:3000/api/ingest', {
      method: 'POST',
      body: JSON.stringify({ feedUrl: 'https://example.com/feed.xml' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.items[0]).toHaveProperty('title');
    expect(data.items[0]).toHaveProperty('link');
    expect(data.items[0]).toHaveProperty('author');
    expect(data.items[0]).toHaveProperty('categories');
  });
});

describe('GET /api/ingest', () => {
  beforeEach(() => {
    clearAll();
  });

  it('should return feed details by ID', async () => {
    const mockFeed = {
      id: 'test-feed-id',
      url: 'https://example.com/feed.xml',
      title: 'Test Feed',
      description: 'A test feed',
      link: 'https://example.com',
      lastFetched: new Date().toISOString(),
      itemCount: 0,
    };

    storeFeed(mockFeed);

    const request = new NextRequest(
      'http://localhost:3000/api/ingest?feedId=test-feed-id',
      { method: 'GET' }
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.feed.id).toBe('test-feed-id');
    expect(data.feed.title).toBe('Test Feed');
  });

  it('should return 404 for non-existent feed', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/ingest?feedId=non-existent',
      { method: 'GET' }
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.code).toBe('NOT_FOUND');
  });

  it('should require feedId parameter', async () => {
    const request = new NextRequest('http://localhost:3000/api/ingest', {
      method: 'GET',
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.code).toBe('MISSING_PARAMETER');
  });
});
