/**
 * Feed Ingestion Service - RSS/Atom feed parsing and ingestion
 */

import FeedParser from 'feedparser';
import request from 'request';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import type { ParsedFeed } from '../types/api';
import type { Logger } from 'pino';

export class FeedIngestionService {
  private userAgent: string;
  private timeout: number;
  private maxRetries: number;
  private retryDelay: number;

  constructor(
    private logger: Logger,
    config: {
      userAgent: string;
      timeout: number;
      maxRetries: number;
      retryDelay: number;
    }
  ) {
    this.userAgent = config.userAgent;
    this.timeout = config.timeout;
    this.maxRetries = config.maxRetries;
    this.retryDelay = config.retryDelay;
  }

  /**
   * Fetch and parse an RSS/Atom feed with retry logic
   */
  async ingestFeed(url: string): Promise<ParsedFeed> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        this.logger.info({ url, attempt }, 'Fetching feed');
        const feed = await this.fetchAndParse(url);
        this.logger.info({ url, itemCount: feed.items.length }, 'Feed ingested successfully');
        return feed;
      } catch (error) {
        lastError = error as Error;
        this.logger.warn({ url, attempt, error: lastError.message }, 'Feed fetch failed');

        if (attempt < this.maxRetries) {
          await this.sleep(this.retryDelay * attempt); // Exponential backoff
        }
      }
    }

    throw new Error(`Failed to fetch feed after ${this.maxRetries} attempts: ${lastError?.message}`);
  }

  /**
   * Fetch and parse feed (single attempt)
   */
  private async fetchAndParse(url: string): Promise<ParsedFeed> {
    return new Promise((resolve, reject) => {
      const feedparser = new FeedParser({});
      const items: ParsedFeed['items'] = [];
      let meta: ParsedFeed['meta'] | null = null;

      const req = request({
        url,
        timeout: this.timeout,
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml',
        },
      });

      req.on('error', (error) => {
        reject(new Error(`Request failed: ${error.message}`));
      });

      req.on('response', function (res) {
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        }
        // @ts-ignore - pipe exists
        this.pipe(feedparser);
      });

      feedparser.on('error', (error) => {
        reject(new Error(`Feed parsing failed: ${error.message}`));
      });

      feedparser.on('meta', (feedMeta) => {
        meta = {
          title: feedMeta.title || 'Untitled Feed',
          description: feedMeta.description,
          link: feedMeta.link,
          language: feedMeta.language,
          copyright: feedMeta.copyright,
          managingEditor: feedMeta.managingEditor,
          webMaster: feedMeta.webMaster,
          pubDate: feedMeta.pubDate ? new Date(feedMeta.pubDate) : undefined,
          lastBuildDate: feedMeta.lastBuildDate ? new Date(feedMeta.lastBuildDate) : undefined,
          category: feedMeta.categories?.[0],
          generator: feedMeta.generator,
          docs: feedMeta.docs,
          cloud: feedMeta.cloud,
          ttl: feedMeta.ttl,
          image: feedMeta.image ? {
            url: feedMeta.image.url,
            title: feedMeta.image.title,
            link: feedMeta.image.link,
            width: feedMeta.image.width,
            height: feedMeta.image.height,
          } : undefined,
        };
      });

      feedparser.on('readable', function () {
        let item;
        // @ts-ignore - read exists
        while ((item = this.read())) {
          items.push({
            title: item.title || 'Untitled',
            description: item.description ? this.sanitizeHtml(item.description) : undefined,
            content: item['content:encoded'] || item.summary ? this.sanitizeHtml(item['content:encoded'] || item.summary) : undefined,
            link: item.link || item.guid || '',
            author: item.author,
            category: item.categories || [],
            comments: item.comments,
            enclosure: item.enclosures?.[0] ? {
              url: item.enclosures[0].url,
              type: item.enclosures[0].type,
              length: item.enclosures[0].length,
            } : undefined,
            guid: item.guid || item.link || `${item.title}-${item.pubDate}`,
            pubDate: item.pubDate ? new Date(item.pubDate) : undefined,
            source: item.source ? {
              url: item.source.url,
              title: item.source.title,
            } : undefined,
          });
        }
      }.bind(this));

      feedparser.on('end', () => {
        if (!meta) {
          return reject(new Error('No feed metadata found'));
        }
        resolve({ meta, items });
      });
    });
  }

  /**
   * Sanitize HTML content to prevent XSS
   */
  private sanitizeHtml(html: string): string {
    const window = new JSDOM('').window;
    const purify = DOMPurify(window);
    
    return purify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
      ALLOW_DATA_ATTR: false,
    });
  }

  /**
   * Calculate reading time based on word count
   */
  calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  /**
   * Extract plain text from HTML
   */
  extractPlainText(html: string): string {
    const window = new JSDOM(html).window;
    return window.document.body.textContent || '';
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
