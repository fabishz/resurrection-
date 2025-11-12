'use client';

import FeedItem from './FeedItem';

// Mock data for demonstration
const mockFeeds = [
  {
    id: '1',
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    unreadCount: 12,
    category: 'Tech',
    favicon: '🚀',
  },
  {
    id: '2',
    name: 'Hacker News',
    url: 'https://news.ycombinator.com/rss',
    unreadCount: 24,
    category: 'Tech',
    favicon: '📰',
  },
  {
    id: '3',
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    unreadCount: 8,
    category: 'Tech',
    favicon: '⚡',
  },
];

export default function FeedList() {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
          Your Feeds
        </h2>
        <span className="badge badge-orange">
          {mockFeeds.reduce((acc, feed) => acc + feed.unreadCount, 0)} unread
        </span>
      </div>

      <div className="space-y-2">
        {mockFeeds.length > 0 ? (
          mockFeeds.map((feed) => <FeedItem key={feed.id} feed={feed} />)
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              No feeds yet. Add your first feed to get started!
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
        <button className="w-full btn-ghost text-sm">
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Feed
          </span>
        </button>
      </div>
    </div>
  );
}
