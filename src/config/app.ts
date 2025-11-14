/**
 * Application Configuration
 * Centralized configuration for the RSS Renaissance app
 */

export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'RSS Renaissance',
  description:
    process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
    'Intelligent RSS Feed Reader with AI-Powered Summaries',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  
  // Navigation
  navigation: [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Feeds', href: '/feeds', icon: '📰' },
    { name: 'Discover', href: '/discover', icon: '🔍' },
    { name: 'Features', href: '/features', icon: '✨' },
    { name: 'About', href: '/about', icon: 'ℹ️' },
    { name: 'Help', href: '/help', icon: '❓' },
    { name: 'Contact', href: '/contact', icon: '📧' },
  ],
  
  // Features
  features: {
    aiSummarization: true,
    deduplication: true,
    offlineMode: true,
    darkMode: true,
  },
  
  // Limits
  limits: {
    maxFeedsPerUser: 100,
    maxArticlesPerFeed: 1000,
    summaryMaxLength: 500,
  },
  
  // Social
  social: {
    github: 'https://github.com/rss-renaissance',
    twitter: 'https://twitter.com/rss_renaissance',
  },
  
  // Copyright
  copyright: `© ${new Date().getFullYear()} RSS Renaissance. Built with ❤️ and AI.`,
} as const;

export type AppConfig = typeof APP_CONFIG;
