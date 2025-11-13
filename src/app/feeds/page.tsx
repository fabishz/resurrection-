'use client';

import { useState } from 'react';
import Header from '@/components/shared/Header';
import FeedList from '@/components/shared/FeedList';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { APP_CONFIG } from '@/config/app';
import { ingestFeed } from '@/lib/api-client';

export default function FeedsPage() {
  const [feedUrl, setFeedUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await ingestFeed(feedUrl);
      setSuccess(`Successfully added feed! Ingested ${result.itemsIngested} articles.`);
      setFeedUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add feed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 text-neutral-900 dark:text-neutral-50">
            Manage Your Feeds
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400">
            Add and organize your RSS feeds
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Feed Form */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-neutral-50">
                Add New Feed
              </h2>
              
              <form onSubmit={handleAddFeed} className="space-y-4">
                <div>
                  <label htmlFor="feedUrl" className="block text-sm font-medium mb-2 text-neutral-900 dark:text-neutral-50">
                    RSS Feed URL
                  </label>
                  <input
                    id="feedUrl"
                    type="url"
                    value={feedUrl}
                    onChange={(e) => setFeedUrl(e.target.value)}
                    placeholder="https://example.com/feed.xml"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-halloween-orange transition-shadow"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading || !feedUrl}
                  className="w-full"
                >
                  {loading ? 'Adding Feed...' : 'Add Feed'}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <h3 className="text-sm font-semibold mb-3 text-neutral-900 dark:text-neutral-50">
                  Popular Feeds
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
                    { name: 'Hacker News', url: 'https://news.ycombinator.com/rss' },
                    { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
                    { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index' },
                  ].map((feed) => (
                    <button
                      key={feed.name}
                      onClick={() => setFeedUrl(feed.url)}
                      className="px-4 py-2 text-left text-sm bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                    >
                      {feed.name}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Feed List Sidebar */}
          <div className="lg:col-span-1">
            <FeedList />
          </div>
        </div>
      </main>
    </div>
  );
}
