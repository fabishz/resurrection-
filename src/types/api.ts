// API Request/Response Types

export interface IngestRequest {
  feedUrl: string;
  userId?: string;
}

export interface IngestResponse {
  success: boolean;
  feedId: string;
  itemsIngested: number;
  items: FeedItem[];
  error?: string;
}

export interface SummarizeRequest {
  articleId?: string;
  content?: string;
  title?: string;
  maxLength?: number;
}

export interface SummarizeResponse {
  success: boolean;
  summary: string;
  keyPoints?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  categories?: string[];
  processingTime?: number;
  error?: string;
}

export interface FeedItem {
  id: string;
  feedId: string;
  title: string;
  link: string;
  content: string;
  contentSnippet: string;
  pubDate: string;
  author?: string;
  categories?: string[];
  guid?: string;
  isoDate?: string;
}

export interface Feed {
  id: string;
  url: string;
  title: string;
  description?: string;
  link?: string;
  lastFetched: string;
  itemCount: number;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
}
