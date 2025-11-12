/**
 * RSS Feed Parser Service
 * Fetches and normalizes RSS/Atom feeds
 */

import Parser from 'rss-parser';
import { Feed, FeedItem } from '@/types/api';
import crypto from 'crypto';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'RSS-Renaissance/1.0',
  },
});

/**
 * Fetch and parse RSS feed
 */
export async function fetchFeed(feedUrl: string): Promise<{
  feed: Feed;
  items: FeedItem[];
}> {
  try {
    const parsedFeed = await parser.parseURL(feedUrl);

    // Generate feed ID from URL
    const feedId = generateId(feedUrl);

    const feed: Feed = {
      id: feedId,
      url: feedUrl,
      title: parsedFeed.title || 'Untitled Feed',
      description: parsedFeed.description,
      link: parsedFeed.link,
      lastFetched: new Date().toISOString(),
      itemCount: parsedFeed.items?.length || 0,
    };

    const items: FeedItem[] = (parsedFeed.items || []).map((item) => {
      const itemId = generateId(item.guid || item.link || item.title || '');

      return {
        id: itemId,
        feedId,
        title: item.title || 'Untitled',
        link: item.link || '',
        content: item.content || item['content:encoded'] || item.contentSnippet || '',
        contentSnippet: item.contentSnippet || '',
        pubDate: item.pubDate || new Date().toISOString(),
        author: item.creator || item.author,
        categories: item.categories || [],
        guid: item.guid,
        isoDate: item.isoDate,
      };
    });

    return { feed, items };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch feed: ${error.message}`);
    }
    throw new Error('Failed to fetch feed: Unknown error');
  }
}

/**
 * Validate feed URL
 */
export function validateFeedUrl(url: string): { valid: boolean; error?: string } {
  try {
    const parsed = new URL(url);

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: 'URL must use HTTP or HTTPS protocol' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

/**
 * Generate deterministic ID from string
 */
export function generateId(input: string): string {
  return crypto.createHash('md5').update(input).digest('hex').slice(0, 16);
}

/**
 * Normalize feed item content
 * Removes HTML tags and extra whitespace
 */
export function normalizeContent(html: string): string {
  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, ' ');

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

/**
 * Extract excerpt from content
 */
export function extractExcerpt(content: string, maxLength: number = 200): string {
  const normalized = normalizeContent(content);

  if (normalized.length <= maxLength) {
    return normalized;
  }

  // Find last complete sentence within maxLength
  const truncated = normalized.slice(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastQuestion = truncated.lastIndexOf('?');
  const lastExclamation = truncated.lastIndexOf('!');

  const lastSentenceEnd = Math.max(lastPeriod, lastQuestion, lastExclamation);

  if (lastSentenceEnd > maxLength * 0.5) {
    return truncated.slice(0, lastSentenceEnd + 1);
  }

  // No sentence boundary found, truncate at word boundary
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.slice(0, lastSpace) + '...';
}
