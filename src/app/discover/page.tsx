import Header from '@/components/shared/Header';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { APP_CONFIG } from '@/config/app';

const FEATURED_FEEDS = [
  {
    category: 'Technology',
    feeds: [
      { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', description: 'Latest technology news and startup coverage', subscribers: '2.5M' },
      { name: 'Hacker News', url: 'https://news.ycombinator.com/rss', description: 'Tech news and discussions from Y Combinator', subscribers: '1.8M' },
      { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', description: 'Technology, science, art, and culture', subscribers: '3.2M' },
      { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', description: 'In-depth tech analysis and reviews', subscribers: '1.5M' },
    ],
  },
  {
    category: 'Development',
    feeds: [
      { name: 'CSS-Tricks', url: 'https://css-tricks.com/feed/', description: 'Web development tips and tutorials', subscribers: '890K' },
      { name: 'Smashing Magazine', url: 'https://www.smashingmagazine.com/feed/', description: 'For web designers and developers', subscribers: '1.2M' },
      { name: 'Dev.to', url: 'https://dev.to/feed', description: 'Community of software developers', subscribers: '2.1M' },
    ],
  },
  {
    category: 'Design',
    feeds: [
      { name: 'Dribbble', url: 'https://dribbble.com/shots/popular.rss', description: 'Design inspiration and portfolios', subscribers: '1.6M' },
      { name: 'Behance', url: 'https://www.behance.net/feeds/projects', description: 'Creative work showcase', subscribers: '2.3M' },
    ],
  },
  {
    category: 'Business',
    feeds: [
      { name: 'Harvard Business Review', url: 'https://feeds.hbr.org/harvardbusiness', description: 'Business management insights', subscribers: '1.1M' },
      { name: 'Entrepreneur', url: 'https://www.entrepreneur.com/latest.rss', description: 'Startup and business advice', subscribers: '980K' },
    ],
  },
];

export default function DiscoverPage() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-900">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 text-white">
            Discover Feeds
          </h1>
          <p className="text-xl text-neutral-300">
            Explore popular RSS feeds across different categories
          </p>
        </div>

        <div className="space-y-8">
          {FEATURED_FEEDS.map((category) => (
            <div key={category.category}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
                  {category.category}
                </h2>
                <Badge variant="purple">{category.feeds.length} feeds</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.feeds.map((feed) => (
                  <Card key={feed.name} className="hover:shadow-lg transition-shadow duration-300">
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                          {feed.name}
                        </h3>
                        <Badge variant="orange">{feed.subscribers}</Badge>
                      </div>
                      
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 flex-1">
                        {feed.description}
                      </p>
                      
                      <button className="w-full px-4 py-2 bg-halloween-orange hover:bg-halloween-purple text-white rounded-lg font-medium transition-colors duration-300">
                        Add Feed
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-gradient-to-r from-halloween-orange to-halloween-purple rounded-2xl text-white text-center">
          <h2 className="text-3xl font-bold mb-3">Can't find what you're looking for?</h2>
          <p className="text-lg mb-6 opacity-90">
            Add any RSS feed URL manually from the Feeds page
          </p>
          <a
            href="/feeds"
            className="inline-block px-8 py-3 bg-white text-halloween-orange font-semibold rounded-xl hover:bg-neutral-100 transition-colors"
          >
            Go to Feeds
          </a>
        </div>
      </main>
    </div>
  );
}
