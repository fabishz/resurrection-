'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Icon from '@/components/ui/Icon';
import { getAllFeeds } from '@/lib/api-client';

interface FeedData {
  id: string;
  url: string;
  title: string;
  description?: string;
  itemCount: number;
  latestArticle?: string | null;
  latestArticleDate?: string | null;
  lastFetched: string;
}

export default function FeedList() {
  const [feeds, setFeeds] = useState<FeedData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeeds = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllFeeds();
      setFeeds(response.feeds);
    } catch (err) {
      console.error('Failed to load feeds:', err);
      setError(err instanceof Error ? err.message : 'Failed to load feeds');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeeds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalArticles = feeds.reduce((sum, feed) => sum + feed.itemCount, 0);

  if (loading) {
    return (
      <Card className="bg-neutral-800 border-neutral-700">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-neutral-800 border-neutral-700">
        <div className="text-center py-8">
          <Icon name="warning" size="xl" className="text-red-400 mx-auto mb-3" />
          <p className="text-sm text-red-300 mb-4">{error}</p>
          <Button variant="secondary" onClick={loadFeeds} className="text-sm">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-neutral-800 border-neutral-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">
          Your Feeds
        </h2>
        <Badge variant="orange">{totalArticles} articles</Badge>
      </div>

      <div className="space-y-3">
        {feeds.length > 0 ? (
          feeds.map((feed) => (
            <Link
              key={feed.id}
              href={`/feed/${feed.id}`}
              className="block p-4 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white truncate mb-1">
                    {feed.title}
                  </h3>
                  <p className="text-xs text-neutral-400 truncate">
                    {feed.url}
                  </p>
                </div>
                <Badge variant="purple" className="ml-2 flex-shrink-0">
                  {feed.itemCount}
                </Badge>
              </div>
              {feed.latestArticle && (
                <p className="text-xs text-neutral-300 truncate mt-2">
                  Latest: {feed.latestArticle}
                </p>
              )}
            </Link>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-sm text-neutral-400 mb-4">
              No feeds yet. Add your first feed to get started!
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-neutral-700">
        <Link href="/feeds">
          <Button variant="ghost" className="w-full text-sm text-white hover:bg-neutral-700">
            <span className="flex items-center justify-center gap-2">
              <Icon name="plus" size="sm" />
              Add New Feed
            </span>
          </Button>
        </Link>
      </div>
    </Card>
  );
}
