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
    console.log(`[Feed Parser] Fetching feed from: ${feedUrl}`);

    // Fetch the feed XML
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'RSS-Renaissance/1.0',
        'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    console.log(`[Feed Parser] Content-Type: ${contentType}`);

    // Get the XML text
    const xmlText = await response.text();
    
    if (!xmlText || xmlText.trim().length === 0) {
      throw new Error('Empty response from feed URL');
    }

    console.log(`[Feed Parser] Received ${xmlText.length} bytes of XML`);

    // Parse the XML using rss-parser
    const parsedFeed = await parser.parseString(xmlText);

    console.log(`[Feed Parser] Successfully parsed feed: ${parsedFeed.title}`);
    console.log(`[Feed Parser] Found ${parsedFeed.items?.length || 0} items`);

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

    console.log(`[Feed Parser] Processed ${items.length} items`);

    return { feed, items };
  } catch (error) {
    console.error('[Feed Parser] Error:', error);
    
    if (error instanceof Error) {
      // Provide more specific error messages
      if (error.message.includes('fetch failed')) {
        throw new Error(`Network error: Unable to reach ${feedUrl}. Please check the URL and try again.`);
      }
      if (error.message.includes('HTTP 404')) {
        throw new Error(`Feed not found (404). Please verify the URL is correct.`);
      }
      if (error.message.includes('HTTP 403')) {
        throw new Error(`Access forbidden (403). The feed may block automated requests.`);
      }
      if (error.message.includes('HTTP 500') || error.message.includes('HTTP 502') || error.message.includes('HTTP 503')) {
        throw new Error(`Server error. The feed server is temporarily unavailable.`);
      }
      if (error.message.includes('timeout')) {
        throw new Error(`Request timeout. The feed server took too long to respond.`);
      }
      
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
