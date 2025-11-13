/**
 * API Client for RSS Renaissance
 * Centralized API communication layer
 */

import type { IngestRequest, IngestResponse, ApiError } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data as ApiError;
      throw new Error(error.error || `API error: ${response.statusText}`);
    }

    return data as T;
  } catch (error) {
    console.error(`[API Client] Error fetching ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Ingest a new RSS feed
 */
export async function ingestFeed(
  feedUrl: string,
  userId?: string
): Promise<IngestResponse> {
  const body: IngestRequest = { feedUrl, userId };

  return fetchAPI<IngestResponse>('/ingest', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Get feed details by ID
 */
export async function getFeed(feedId: string) {
  return fetchAPI(`/ingest?feedId=${feedId}`, {
    method: 'GET',
  });
}

/**
 * Summarize article content
 */
export async function summarizeArticle(content: string, title?: string) {
  return fetchAPI('/summarize', {
    method: 'POST',
    body: JSON.stringify({ content, title }),
  });
}

/**
 * Get all feeds (from storage)
 * This would typically come from a database in production
 */
export async function getAllFeeds() {
  // For now, this returns mock data
  // In production, this would call a real API endpoint
  return {
    success: true,
    feeds: [],
  };
}

/**
 * Get all articles across feeds
 */
export async function getAllArticles() {
  // For now, this returns mock data
  // In production, this would call a real API endpoint
  return {
    success: true,
    articles: [],
  };
}
