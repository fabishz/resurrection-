import Link from 'next/link';
import Header from '@/components/shared/Header';
import FeedList from '@/components/shared/FeedList';
import ArticleList from '@/components/shared/ArticleList';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { APP_CONFIG } from '@/config/app';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section with Gradient */}
        <div className="bg-gradient-to-br from-halloween-orange via-halloween-purple to-halloween-green py-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center text-white animate-fade-in">
              <div className="text-6xl mb-6">🎃</div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Welcome to {APP_CONFIG.name}
              </h1>
              <p className="text-2xl md:text-3xl mb-8 opacity-90">
                {APP_CONFIG.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/feeds"
                  className="px-8 py-4 bg-white text-halloween-orange font-bold rounded-xl hover:bg-neutral-100 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Get Started
                </Link>
                <Link
                  href="/discover"
                  className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/30 transition-all duration-300 border-2 border-white/50"
                >
                  Discover Feeds
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-12 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Active Feeds', value: '1,000+', icon: '📰' },
                { label: 'Articles Processed', value: '50K+', icon: '📄' },
                { label: 'AI Summaries', value: '25K+', icon: '🤖' },
                { label: 'Happy Users', value: '500+', icon: '😊' },
              ].map((stat) => (
                <div key={stat.label} className="text-center animate-slide-up">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold text-halloween-orange dark:text-halloween-purple mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-neutral-50 dark:bg-neutral-950">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-neutral-900 dark:text-neutral-50">
                Powerful Features
              </h2>
              <p className="text-xl text-neutral-600 dark:text-neutral-400">
                Everything you need for intelligent RSS feed management
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: '🤖',
                  title: 'AI-Powered Summaries',
                  description: 'Get instant AI-generated summaries of articles, saving you time and helping you stay informed.',
                  color: 'orange',
                },
                {
                  icon: '🔄',
                  title: 'Smart Deduplication',
                  description: 'Automatically detect and remove duplicate articles across multiple feeds.',
                  color: 'purple',
                },
                {
                  icon: '🌙',
                  title: 'Dark Mode',
                  description: 'Beautiful dark mode that is easy on your eyes during late-night reading sessions.',
                  color: 'green',
                },
                {
                  icon: '📱',
                  title: 'Responsive Design',
                  description: 'Seamless experience across all devices - desktop, tablet, and mobile.',
                  color: 'orange',
                },
                {
                  icon: '🔒',
                  title: 'Privacy First',
                  description: 'Your data stays private. No tracking, no ads, just pure RSS goodness.',
                  color: 'purple',
                },
                {
                  icon: '⚡',
                  title: 'Lightning Fast',
                  description: 'Built with Next.js 16 and Turbopack for blazing fast performance.',
                  color: 'green',
                },
              ].map((feature) => (
                <Card key={feature.title} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-neutral-50">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    {feature.description}
                  </p>
                  <Badge variant={feature.color as any}>Learn More</Badge>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="py-16 bg-white dark:bg-neutral-900">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Articles Section */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
                    Latest Articles
                  </h2>
                  <Link
                    href="/feeds"
                    className="text-halloween-orange hover:text-halloween-purple transition-colors font-medium"
                  >
                    View All →
                  </Link>
                </div>
                <ArticleList />
              </div>

              {/* Feeds Sidebar */}
              <div className="lg:col-span-1">
                <FeedList />
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 bg-gradient-to-r from-halloween-orange to-halloween-purple">
          <div className="container mx-auto px-4 max-w-4xl text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your RSS Experience?
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Join hundreds of users who are already enjoying intelligent feed reading
            </p>
            <Link
              href="/feeds"
              className="inline-block px-10 py-5 bg-white text-halloween-orange font-bold text-lg rounded-xl hover:bg-neutral-100 transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              Add Your First Feed
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-12 bg-white dark:bg-neutral-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🎃</span>
                <div>
                  <p className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                    {APP_CONFIG.name}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Intelligent Feed Reader
                  </p>
                </div>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                {APP_CONFIG.description}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-neutral-900 dark:text-neutral-50 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {APP_CONFIG.navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-neutral-600 dark:text-neutral-400 hover:text-halloween-orange dark:hover:text-halloween-purple transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-bold text-neutral-900 dark:text-neutral-50 mb-4">Features</h3>
              <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
                <li>AI Summaries</li>
                <li>Deduplication</li>
                <li>Dark Mode</li>
                <li>Offline Mode</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800 text-center text-sm text-neutral-600 dark:text-neutral-400">
            <p>{APP_CONFIG.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
