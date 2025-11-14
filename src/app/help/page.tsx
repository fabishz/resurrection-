/**
 * Help / FAQ Page
 * Common questions with expandable answers
 */

'use client';

import { useState } from 'react';
import Header from '@/components/shared/Header';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'Getting Started',
    question: 'How do I add my first RSS feed?',
    answer: 'Navigate to the Feeds page, enter the RSS feed URL in the input field, and click "Add Feed". You can also browse curated feeds on the Discover page and add them with one click.',
  },
  {
    category: 'Getting Started',
    question: 'What is an RSS feed URL?',
    answer: 'An RSS feed URL is a web address that provides a structured feed of content from a website. It usually ends in .xml, .rss, or /feed. Most blogs and news sites have RSS feeds—look for an RSS icon or check the site\'s footer.',
  },
  {
    category: 'Getting Started',
    question: 'How many feeds can I add?',
    answer: 'You can add unlimited RSS feeds. There are no restrictions on the number of feeds you can subscribe to.',
  },
  {
    category: 'AI Features',
    question: 'How do AI summaries work?',
    answer: 'Click the "Summarize" button on any article to generate an instant AI summary. Our AI reads the article content, extracts key points, and creates a concise summary in 1-3 seconds. Summaries include bullet-point highlights and sentiment analysis.',
  },
  {
    category: 'AI Features',
    question: 'Are AI summaries accurate?',
    answer: 'Our AI summaries are powered by advanced language models and are generally very accurate. However, we recommend reading the full article for critical information. Summaries are meant to help you decide what to read, not replace reading.',
  },
  {
    category: 'AI Features',
    question: 'Do AI summaries cost extra?',
    answer: 'AI summaries are included in the free tier with reasonable usage limits. For unlimited summaries, consider upgrading to a premium plan.',
  },
  {
    category: 'Features',
    question: 'What is smart deduplication?',
    answer: 'Smart deduplication automatically identifies and removes duplicate articles across your feeds. It uses content analysis and URL normalization to detect when the same story appears in multiple feeds, reducing information overload by up to 80%.',
  },
  {
    category: 'Features',
    question: 'Can I organize feeds by category?',
    answer: 'Yes! You can organize your feeds into custom categories for easier navigation and filtering. This feature helps you manage large numbers of feeds efficiently.',
  },
  {
    category: 'Features',
    question: 'Does RSS Renaissance work offline?',
    answer: 'Yes, RSS Renaissance caches articles locally so you can read them offline. Once articles are loaded, you can access them without an internet connection.',
  },
  {
    category: 'Privacy & Security',
    question: 'Is my data private?',
    answer: 'Absolutely. We don\'t track your reading habits, sell your data, or show ads. Your feed subscriptions and reading history stay on your device. We only store what\'s necessary to provide the service.',
  },
  {
    category: 'Privacy & Security',
    question: 'Do you share my information with third parties?',
    answer: 'No. We never share, sell, or rent your personal information to third parties. Your privacy is our top priority.',
  },
  {
    category: 'Privacy & Security',
    question: 'How is my data stored?',
    answer: 'Your data is stored securely using industry-standard encryption. Feed data is cached temporarily to improve performance, and you can clear your data at any time.',
  },
  {
    category: 'Technical',
    question: 'Which browsers are supported?',
    answer: 'RSS Renaissance works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version for the best experience.',
  },
  {
    category: 'Technical',
    question: 'Is there a mobile app?',
    answer: 'Currently, RSS Renaissance is a web application that works great on mobile browsers. A dedicated mobile app is planned for the future.',
  },
  {
    category: 'Technical',
    question: 'What if a feed won\'t load?',
    answer: 'Some feeds may be temporarily unavailable or have invalid URLs. Check that the URL is correct and the feed is publicly accessible. If problems persist, contact support.',
  },
  {
    category: 'Account & Billing',
    question: 'Do I need an account?',
    answer: 'Currently, RSS Renaissance works without an account. Your feeds are stored locally in your browser. Account features for syncing across devices are coming soon.',
  },
  {
    category: 'Account & Billing',
    question: 'Is RSS Renaissance free?',
    answer: 'Yes! RSS Renaissance is free to use with generous limits. Premium features like unlimited AI summaries and advanced analytics are available with a paid plan.',
  },
  {
    category: 'Account & Billing',
    question: 'How do I upgrade to premium?',
    answer: 'Premium plans are coming soon! You\'ll be able to upgrade directly from the app with flexible monthly or annual billing.',
  },
];

const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredFaqs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter((faq) => faq.category === selectedCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-900">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-black py-20 px-4 border-b border-neutral-800">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Help Center
          </h1>
          <p className="text-xl md:text-2xl text-neutral-300 mb-8">
            Find answers to common questions
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help..."
                className="w-full px-6 py-4 pl-12 rounded-xl border border-neutral-600 bg-neutral-800 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-halloween-orange"
              />
              <Icon name="search" size="md" className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-16 max-w-6xl">
        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === 'All'
                ? 'bg-halloween-orange text-white'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-halloween-orange text-white'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4 mb-16">
          {filteredFaqs.map((faq, index) => (
            <Card key={index} className="bg-neutral-800 border-neutral-700">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-start justify-between gap-4 text-left"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-neutral-500">{faq.category}</p>
                </div>
                <div className="flex-shrink-0">
                  <svg
                    className={`w-6 h-6 text-neutral-400 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {openIndex === index && (
                <div className="mt-4 pt-4 border-t border-neutral-700">
                  <p className="text-neutral-300">{faq.answer}</p>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Quick Links */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-neutral-800 border-neutral-700 text-center">
            <Icon name="document" size="xl" className="text-halloween-orange mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Documentation</h3>
            <p className="text-neutral-400 mb-4">
              Detailed guides and tutorials
            </p>
            <Link
              href="/about"
              className="text-halloween-orange hover:text-halloween-purple transition-colors font-medium"
            >
              Read Docs →
            </Link>
          </Card>

          <Card className="bg-neutral-800 border-neutral-700 text-center">
            <Icon name="info" size="xl" className="text-halloween-purple mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Contact Support</h3>
            <p className="text-neutral-400 mb-4">
              Get help from our team
            </p>
            <Link
              href="/contact"
              className="text-halloween-orange hover:text-halloween-purple transition-colors font-medium"
            >
              Contact Us →
            </Link>
          </Card>

          <Card className="bg-neutral-800 border-neutral-700 text-center">
            <Icon name="sparkles" size="xl" className="text-halloween-orange mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Feature Requests</h3>
            <p className="text-neutral-400 mb-4">
              Suggest new features
            </p>
            <Link
              href="/contact"
              className="text-halloween-orange hover:text-halloween-purple transition-colors font-medium"
            >
              Submit Idea →
            </Link>
          </Card>
        </section>
      </main>
    </div>
  );
}
