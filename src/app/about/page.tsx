/**
 * About Page
 * Mission, vision, team, and technology stack
 */

import Link from 'next/link';
import Header from '@/components/shared/Header';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Icon from '@/components/ui/Icon';
import { APP_CONFIG } from '@/config/app';

export const metadata = {
  title: 'About | RSS Renaissance',
  description: 'Learn about RSS Renaissance - the intelligent RSS feed reader powered by AI',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-900">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-black py-20 px-4 border-b border-neutral-800">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            About {APP_CONFIG.name}
          </h1>
          <p className="text-xl md:text-2xl text-neutral-300 mb-8">
            Bringing RSS feeds back to life with the power of AI
          </p>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-16 max-w-6xl">
        {/* Mission Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
              To resurrect RSS feeds with modern AI capabilities, making information consumption intelligent, private, and delightful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-neutral-800 border-neutral-700 text-center">
              <div className="flex justify-center mb-4">
                <Icon name="sparkles" size="xl" className="text-halloween-orange" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI-Powered</h3>
              <p className="text-neutral-400">
                Leverage cutting-edge AI to summarize articles, extract key points, and categorize content automatically.
              </p>
            </Card>

            <Card className="bg-neutral-800 border-neutral-700 text-center">
              <div className="flex justify-center mb-4">
                <Icon name="shield" size="xl" className="text-halloween-purple" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Privacy-First</h3>
              <p className="text-neutral-400">
                Your data stays private. No tracking, no ads, no data selling. Just pure RSS goodness.
              </p>
            </Card>

            <Card className="bg-neutral-800 border-neutral-700 text-center">
              <div className="flex justify-center mb-4">
                <Icon name="bolt" size="xl" className="text-halloween-orange" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Lightning Fast</h3>
              <p className="text-neutral-400">
                Built with Next.js 16 and optimized for performance. Load feeds in seconds, not minutes.
              </p>
            </Card>
          </div>
        </section>

        {/* Story Section */}
        <section className="mb-16">
          <Card className="bg-neutral-800 border-neutral-700">
            <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
            <div className="space-y-4 text-neutral-300">
              <p>
                RSS feeds were once the backbone of the internet, allowing users to curate their own information streams without algorithmic interference. But as social media platforms took over, RSS fell out of favor, leaving power users without their preferred way to consume content.
              </p>
              <p>
                We believe RSS deserves a renaissance. With modern AI capabilities, we can solve the problems that made RSS overwhelming—too many articles, duplicate content, and information overload—while preserving what made it great: user control, privacy, and direct access to sources.
              </p>
              <p>
                RSS Renaissance combines the best of both worlds: the freedom and privacy of RSS with the intelligence and convenience of modern AI. We're not building another feed reader—we're building the future of intentional content consumption.
              </p>
            </div>
          </Card>
        </section>

        {/* Technology Stack */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Next.js 16', category: 'Framework' },
              { name: 'TypeScript', category: 'Language' },
              { name: 'Tailwind CSS', category: 'Styling' },
              { name: 'OpenAI API', category: 'AI' },
              { name: 'PostgreSQL', category: 'Database' },
              { name: 'Redis', category: 'Caching' },
              { name: 'Vercel', category: 'Hosting' },
              { name: 'Prisma', category: 'ORM' },
            ].map((tech) => (
              <Card key={tech.name} className="bg-neutral-800 border-neutral-700 text-center">
                <h3 className="text-lg font-semibold text-white mb-1">{tech.name}</h3>
                <Badge variant="purple" className="text-xs">{tech.category}</Badge>
              </Card>
            ))}
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: 'sparkles',
                title: 'AI Summaries',
                description: 'Get instant AI-generated summaries of articles with key points extraction.',
              },
              {
                icon: 'bolt',
                title: 'Smart Deduplication',
                description: 'Automatically detect and remove duplicate articles across multiple feeds.',
              },
              {
                icon: 'rss',
                title: 'Feed Management',
                description: 'Add unlimited RSS feeds and organize them by category.',
              },
              {
                icon: 'moon',
                title: 'Dark Mode',
                description: 'Beautiful dark mode that is easy on your eyes during late-night reading.',
              },
              {
                icon: 'phone',
                title: 'Responsive Design',
                description: 'Seamless experience across all devices—desktop, tablet, and mobile.',
              },
              {
                icon: 'shield',
                title: 'Privacy First',
                description: 'No tracking, no ads, no data selling. Your reading habits stay private.',
              },
            ].map((feature) => (
              <Card key={feature.title} className="bg-neutral-800 border-neutral-700">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Icon name={feature.icon as any} size="lg" className="text-halloween-orange" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-neutral-400">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="bg-gradient-to-br from-neutral-800 to-neutral-900 border-neutral-700">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-neutral-300 mb-8">
              Join hundreds of users who are already enjoying intelligent feed reading
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/feeds"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-halloween-orange text-white font-bold rounded-xl hover:bg-halloween-purple transition-colors"
              >
                <Icon name="plus" size="md" />
                Add Your First Feed
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-700 text-white font-bold rounded-xl hover:bg-neutral-600 transition-colors"
              >
                <Icon name="sparkles" size="md" />
                Explore Features
              </Link>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
