/**
 * API types for RSS Renaissance Backend
 */

import { z } from 'zod';

// Base API response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

// Error response
export interface ApiError {
  success: false;
  error: string;
  code?: string;
  details?: any;
  errorId?: string;
}

// Feed ingestion request/response
export const IngestFeedSchema = z.object({
  url: z.string().url('Invalid feed URL'),
  userId: z.string().optional(),
});

export type IngestFeedRequest = z.infer<typeof IngestFeedSchema>;

export interface IngestFeedResponse {
  success: true;
  feedId: string;
  title: string;
  description?: string;
  itemsIngested: number;
  items: FeedItem[];
  processingTime: number;
}

// Feed item
export interface FeedItem {
  id: string;
  title: string;
  description?: string;
  content?: string;
  link: string;
  author?: string;
  category: string[];
  pubDate?: string;
  guid: string;
}

// Feed response
export interface FeedResponse {
  id: string;
  url: string;
  title: string;
  description?: string;
  link?: string;
  itemCount: number;
  lastFetched?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Article response
export interface ArticleResponse {
  id: string;
  title: string;
  description?: string;
  content?: string;
  link: string;
  author?: string;
  category: string[];
  pubDate?: string;
  feedId: string;
  feedTitle: string;
  isRead: boolean;
  isBookmarked: boolean;
  createdAt: string;
}

// Summary request/response
export const SummarizeSchema = z.object({
  articleId: z.string().min(1, 'Article ID is required'),
  force: z.boolean().optional().default(false),
});

export type SummarizeRequest = z.infer<typeof SummarizeSchema>;

export interface SummaryResponse {
  id: string;
  content: string;
  keyPoints: string[];
  sentiment?: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  categories: string[];
  confidence?: number;
  model: string;
  processingTime?: number;
  createdAt: string;
}

// Contact form
export const ContactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.enum(['GENERAL', 'SUPPORT', 'FEATURE', 'BUG', 'FEEDBACK', 'OTHER']),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export type ContactRequest = z.infer<typeof ContactSchema>;

export interface ContactResponse {
  success: true;
  message: string;
  contactId: string;
}

// Pagination
export const PaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationParams = z.infer<typeof PaginationSchema>;

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Health check
export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  services: {
    database: 'connected' | 'disconnected' | 'error';
    redis: 'connected' | 'disconnected' | 'error';
    openai: 'available' | 'unavailable' | 'error';
  };
  metrics?: {
    totalFeeds: number;
    totalArticles: number;
    totalSummaries: number;
    memoryUsage: NodeJS.MemoryUsage;
  };
}

// Job types
export interface JobData {
  type: 'FEED_INGEST' | 'ARTICLE_SUMMARIZE' | 'CACHE_CLEANUP' | 'FEED_REFRESH' | 'EMAIL_SEND';
  payload: any;
  options?: {
    delay?: number;
    attempts?: number;
    backoff?: {
      type: 'exponential' | 'fixed';
      delay: number;
    };
  };
}

// Feed parsing result
export interface ParsedFeed {
  meta: {
    title: string;
    description?: string;
    link?: string;
    language?: string;
    copyright?: string;
    managingEditor?: string;
    webMaster?: string;
    pubDate?: Date;
    lastBuildDate?: Date;
    category?: string;
    generator?: string;
    docs?: string;
    cloud?: string;
    ttl?: number;
    image?: {
      url: string;
      title?: string;
      link?: string;
      width?: number;
      height?: number;
    };
  };
  items: {
    title: string;
    description?: string;
    content?: string;
    link: string;
    author?: string;
    category: string[];
    comments?: string;
    enclosure?: {
      url: string;
      type: string;
      length?: number;
    };
    guid: string;
    pubDate?: Date;
    source?: {
      url: string;
      title?: string;
    };
  }[];
}
