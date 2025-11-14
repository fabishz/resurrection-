'use client';

import { useState } from 'react';
import Header from '@/components/shared/Header';
import FeedList from '@/components/shared/FeedList';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ingestFeed } from '@/lib/api-client';

export default function FeedsPage() {
  const [feedUrl, setFeedUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await ingestFeed(feedUrl);
      setSuccess(`Successfully added "${result.items[0]?.feedId || 'feed'}"! Ingested ${result.itemsIngested} articles.`);
      setFeedUrl('');
      // Trigger feed list refresh
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add feed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-900">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-black py-16 px-4 border-b border-neutral-800">
        <div className="container mx-auto max-w-7xl text-center">
          <h1 className="text-5xl font-bold mb-4 text-white">
            Manage Your Feeds
          </h1>
          <p className="text-xl text-neutral-300">
            Add and organize your RSS feeds
          </p>
        </div>
      </div>
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Feed Form */}
          <div className="lg:col-span-2">
            <Card className="mb-8 bg-neutral-800 border-neutral-700">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Add New Feed
              </h2>
              
              <form onSubmit={handleAddFeed} className="space-y-4">
                <div>
                  <label htmlFor="feedUrl" className="block text-sm font-medium mb-2 text-white">
                    RSS Feed URL
                  </label>
                  <input
                    id="feedUrl"
                    type="url"
                    value={feedUrl}
                    onChange={(e) => setFeedUrl(e.target.value)}
                    placeholder="https://example.com/feed.xml"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-neutral-600 bg-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-halloween-orange transition-shadow"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg">
                    <p className="text-sm text-red-200">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
                    <p className="text-sm text-green-200">{success}</p>
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

              <div className="mt-6 pt-6 border-t border-neutral-700">
                <h3 className="text-sm font-semibold mb-3 text-white">
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
                      className="px-4 py-2 text-left text-sm bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
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
            <FeedList key={refreshKey} />
          </div>
        </div>
      </main>
    </div>
  );
}
