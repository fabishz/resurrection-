/**
 * Features Page
 * Detailed feature showcase with demonstrations
 */

import Link from 'next/link';
import Header from '@/components/shared/Header';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Icon from '@/components/ui/Icon';

export const metadata = {
  title: 'Features | RSS Renaissance',
  description: 'Explore all the powerful features of RSS Renaissance - AI summaries, deduplication, and more',
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-900">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-black py-20 px-4 border-b border-neutral-800">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Powerful Features
          </h1>
          <p className="text-xl md:text-2xl text-neutral-300">
            Everything you need for intelligent RSS feed management
          </p>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-16 max-w-6xl">
        {/* AI-Powered Features */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge variant="purple" className="mb-4">AI-Powered</Badge>
            <h2 className="text-4xl font-bold text-white mb-4">Intelligent Content Processing</h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              Leverage cutting-edge AI to make sense of your content
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-neutral-800 border-neutral-700">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-halloween-purple/20 rounded-lg flex items-center justify-center">
                  <Icon name="sparkles" size="lg" className="text-halloween-purple" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">AI Summaries</h3>
                  <Badge variant="orange" className="mb-4">Instant</Badge>
                </div>
              </div>
              <p className="text-neutral-300 mb-4">
                Get concise AI-generated summaries of any article in seconds. Our AI extracts key points, analyzes sentiment, and categorizes content automatically.
              </p>
              <ul className="space-y-2 text-neutral-400">
                <li className="flex items-start gap-2">
                  <span className="text-halloween-orange mt-1">✓</span>
                  <span>Instant summary generation (1-3 seconds)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-halloween-orange mt-1">✓</span>
                  <span>Key points extraction in bullet format</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-halloween-orange mt-1">✓</span>
                  <span>Sentiment analysis (positive/negative/neutral)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-halloween-orange mt-1">✓</span>
                  <span>Automatic categorization</span>
                </li>
              </ul>
            </Card>

            <Card className="bg-neutral-800 border-neutral-700">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-halloween-orange/20 rounded-lg flex items-center justify-center">
                  <Icon name="bolt" size="lg" className="text-halloween-orange" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Smart Deduplication</h3>
                  <Badge variant="purple" className="mb-4">Automatic</Badge>
                </div>
              </div>
              <p className="text-neutral-300 mb-4">
                Never see the same article twice. Our intelligent deduplication system identifies and removes duplicate content across all your feeds.
              </p>
              <ul className="space-y-2 text-neutral-400">
                <li className="flex items-start gap-2">
                  <span className="text-halloween-orange mt-1">✓</span>
                  <span>Content-based duplicate detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-halloween-orange mt-1">✓</span>
                  <span>URL normalization and tracking parameter removal</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-halloween-orange mt-1">✓</span>
                  <span>Fuzzy matching for similar articles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-halloween-orange mt-1">✓</span>
                  <span>Reduces information overload by 80%+</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Feed Management */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge variant="orange" className="mb-4">Feed Management</Badge>
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Feed Organization</h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              Add, organize, and manage unlimited RSS feeds with ease
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-neutral-800 border-neutral-700">
              <Icon name="rss" size="xl" className="text-halloween-orange mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Unlimited Feeds</h3>
              <p className="text-neutral-400">
                Add as many RSS feeds as you want. No limits, no restrictions.
              </p>
            </Card>

            <Card className="bg-neutral-800 border-neutral-700">
              <Icon name="grid" size="xl" className="text-halloween-purple mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Category Organization</h3>
              <p className="text-neutral-400">
                Organize feeds by category for easy navigation and filtering.
              </p>
            </Card>

            <Card className="bg-neutral-800 border-neutral-700">
              <Icon name="search" size="xl" className="text-halloween-orange mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Feed Discovery</h3>
              <p className="text-neutral-400">
                Browse curated feeds by category or add your own custom feeds.
              </p>
            </Card>
          </div>
        </section>

        {/* User Experience */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge variant="purple" className="mb-4">User Experience</Badge>
            <h2 className="text-4xl font-bold text-white mb-4">Designed for Readers</h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              Every detail crafted for the best reading experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-neutral-800 border-neutral-700">
              <div className="flex items-center gap-3 mb-4">
                <Icon name="moon" size="lg" className="text-halloween-purple" />
                <h3 className="text-xl font-bold text-white">Dark Mode</h3>
              </div>
              <p className="text-neutral-400 mb-4">
                Beautiful dark mode that is easy on your eyes during late-night reading sessions. Carefully crafted color palette with perfect contrast ratios.
              </p>
              <div className="flex gap-2">
                <div className="w-12 h-12 bg-neutral-900 rounded border border-neutral-700"></div>
                <div className="w-12 h-12 bg-neutral-800 rounded border border-neutral-700"></div>
                <div className="w-12 h-12 bg-halloween-orange rounded"></div>
                <div className="w-12 h-12 bg-halloween-purple rounded"></div>
              </div>
            </Card>

            <Card className="bg-neutral-800 border-neutral-700">
              <div className="flex items-center gap-3 mb-4">
                <Icon name="phone" size="lg" className="text-halloween-orange" />
                <h3 className="text-xl font-bold text-white">Responsive Design</h3>
              </div>
              <p className="text-neutral-400 mb-4">
                Seamless experience across all devices. Whether you're on desktop, tablet, or mobile, RSS Renaissance adapts perfectly.
              </p>
              <div className="flex gap-4 text-neutral-500">
                <div className="text-center">
                  <div className="w-16 h-20 bg-neutral-700 rounded mb-2"></div>
                  <p className="text-xs">Mobile</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-neutral-700 rounded mb-2"></div>
                  <p className="text-xs">Tablet</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-16 bg-neutral-700 rounded mb-2"></div>
                  <p className="text-xs">Desktop</p>
                </div>
              </div>
            </Card>

            <Card className="bg-neutral-800 border-neutral-700">
              <div className="flex items-center gap-3 mb-4">
                <Icon name="bolt" size="lg" className="text-halloween-purple" />
                <h3 className="text-xl font-bold text-white">Lightning Fast</h3>
              </div>
              <p className="text-neutral-400">
                Built with Next.js 16 and optimized for performance. Load feeds in seconds, not minutes. 60fps scrolling through thousands of articles.
              </p>
            </Card>

            <Card className="bg-neutral-800 border-neutral-700">
              <div className="flex items-center gap-3 mb-4">
                <Icon name="shield" size="lg" className="text-halloween-orange" />
                <h3 className="text-xl font-bold text-white">Privacy First</h3>
              </div>
              <p className="text-neutral-400">
                No tracking, no ads, no data selling. Your reading habits stay private. We don't even know what feeds you subscribe to.
              </p>
            </Card>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose RSS Renaissance?</h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              See how we compare to traditional RSS readers
            </p>
          </div>

          <Card className="bg-neutral-800 border-neutral-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-700">
                    <th className="text-left py-4 px-6 text-white font-semibold">Feature</th>
                    <th className="text-center py-4 px-6 text-halloween-orange font-semibold">RSS Renaissance</th>
                    <th className="text-center py-4 px-6 text-neutral-500 font-semibold">Traditional Readers</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-300">
                  <tr className="border-b border-neutral-700">
                    <td className="py-4 px-6">AI Summaries</td>
                    <td className="text-center py-4 px-6 text-halloween-orange">✓</td>
                    <td className="text-center py-4 px-6 text-neutral-600">✗</td>
                  </tr>
                  <tr className="border-b border-neutral-700">
                    <td className="py-4 px-6">Smart Deduplication</td>
                    <td className="text-center py-4 px-6 text-halloween-orange">✓</td>
                    <td className="text-center py-4 px-6 text-neutral-600">✗</td>
                  </tr>
                  <tr className="border-b border-neutral-700">
                    <td className="py-4 px-6">Dark Mode</td>
                    <td className="text-center py-4 px-6 text-halloween-orange">✓</td>
                    <td className="text-center py-4 px-6 text-halloween-orange">✓</td>
                  </tr>
                  <tr className="border-b border-neutral-700">
                    <td className="py-4 px-6">Privacy First</td>
                    <td className="text-center py-4 px-6 text-halloween-orange">✓</td>
                    <td className="text-center py-4 px-6 text-neutral-500">~</td>
                  </tr>
                  <tr className="border-b border-neutral-700">
                    <td className="py-4 px-6">Modern UI</td>
                    <td className="text-center py-4 px-6 text-halloween-orange">✓</td>
                    <td className="text-center py-4 px-6 text-neutral-600">✗</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6">Free & Open Source</td>
                    <td className="text-center py-4 px-6 text-halloween-orange">✓</td>
                    <td className="text-center py-4 px-6 text-neutral-500">~</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="bg-gradient-to-br from-neutral-800 to-neutral-900 border-neutral-700">
            <h2 className="text-3xl font-bold text-white mb-4">Experience the Difference</h2>
            <p className="text-xl text-neutral-300 mb-8">
              Start using RSS Renaissance today and transform your reading experience
            </p>
            <Link
              href="/feeds"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-halloween-orange text-white font-bold rounded-xl hover:bg-halloween-purple transition-colors"
            >
              <Icon name="plus" size="md" />
              Get Started Now
            </Link>
          </Card>
        </section>
      </main>
    </div>
  );
}
