import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import { APP_CONFIG } from '@/config/app';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900 px-4">
      <div className="text-center max-w-2xl">
        <div className="flex justify-center mb-6">
          <Icon name="error" className="w-32 h-32 text-halloween-orange dark:text-halloween-purple" />
        </div>
        
        <h1 className="text-6xl font-bold mb-4 text-neutral-900 dark:text-neutral-50">
          404
        </h1>
        
        <h2 className="text-3xl font-semibold mb-4 text-neutral-800 dark:text-neutral-100">
          Page Not Found
        </h2>
        
        <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8">
          The page you're looking for seems to have vanished into the digital void.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-halloween-orange hover:bg-halloween-purple text-white rounded-xl font-semibold transition-colors duration-300"
          >
            Go Home
          </Link>
          
          <Link
            href="/feeds"
            className="px-8 py-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-50 rounded-xl font-semibold transition-colors duration-300"
          >
            Browse Feeds
          </Link>
        </div>
        
        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <p className="text-sm text-neutral-500 dark:text-neutral-500">
            {APP_CONFIG.copyright}
          </p>
        </div>
      </div>
    </div>
  );
}
