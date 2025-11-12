/**
 * In-Memory Storage Service
 * Temporary storage for development
 * Will be replaced with PostgreSQL + Prisma in production
 */

import { Feed, FeedItem } from '@/types/api';

// In-memory stores
const feedsStore = new Map<string, Feed>();
const itemsStore = new Map<string, FeedItem>();
const feedItemsIndex = new Map<string, Set<string>>(); // feedId -> Set<itemId>

/**
 * Store feed
 */
export function storeFeed(feed: Feed): void {
  feedsStore.set(feed.id, feed);

  // Initialize items index for this feed
  if (!feedItemsIndex.has(feed.id)) {
    feedItemsIndex.set(feed.id, new Set());
  }
}

/**
 * Get feed by ID
 */
export function getFeed(feedId: string): Feed | undefined {
  return feedsStore.get(feedId);
}

/**
 * Get all feeds
 */
export function getAllFeeds(): Feed[] {
  return Array.from(feedsStore.values());
}

/**
 * Store feed item
 */
export function storeItem(item: FeedItem): void {
  itemsStore.set(item.id, item);

  // Update feed items index
  const feedItems = feedItemsIndex.get(item.feedId);
  if (feedItems) {
    feedItems.add(item.id);
  } else {
    feedItemsIndex.set(item.feedId, new Set([item.id]));
  }
}

/**
 * Store multiple items
 */
export function storeItems(items: FeedItem[]): void {
  items.forEach((item) => storeItem(item));
}

/**
 * Get item by ID
 */
export function getItem(itemId: string): FeedItem | undefined {
  return itemsStore.get(itemId);
}

/**
 * Get all items for a feed
 */
export function getItemsByFeed(feedId: string): FeedItem[] {
  const itemIds = feedItemsIndex.get(feedId);
  if (!itemIds) {
    return [];
  }

  return Array.from(itemIds)
    .map((id) => itemsStore.get(id))
    .filter((item): item is FeedItem => item !== undefined)
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}

/**
 * Get all items
 */
export function getAllItems(): FeedItem[] {
  return Array.from(itemsStore.values()).sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );
}

/**
 * Delete feed and its items
 */
export function deleteFeed(feedId: string): boolean {
  const feed = feedsStore.get(feedId);
  if (!feed) {
    return false;
  }

  // Delete all items for this feed
  const itemIds = feedItemsIndex.get(feedId);
  if (itemIds) {
    itemIds.forEach((itemId) => itemsStore.delete(itemId));
    feedItemsIndex.delete(feedId);
  }

  feedsStore.delete(feedId);
  return true;
}

/**
 * Clear all data
 */
export function clearAll(): void {
  feedsStore.clear();
  itemsStore.clear();
  feedItemsIndex.clear();
}

/**
 * Get storage statistics
 */
export function getStats(): {
  feedCount: number;
  itemCount: number;
  memoryUsage: string;
} {
  return {
    feedCount: feedsStore.size,
    itemCount: itemsStore.size,
    memoryUsage: `${Math.round((JSON.stringify(Array.from(itemsStore.values())).length / 1024 / 1024) * 100) / 100} MB`,
  };
}
