import Header from '@/components/shared/Header';
import FeedList from '@/components/shared/FeedList';
import ArticleList from '@/components/shared/ArticleList';
import { APP_CONFIG } from '@/config/app';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-3 text-neutral-900 dark:text-neutral-50">
            Welcome to {APP_CONFIG.name}
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400">
            {APP_CONFIG.description}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles Section */}
          <div className="lg:col-span-2">
            <ArticleList />
          </div>

          {/* Feeds Sidebar */}
          <div className="lg:col-span-1">
            <FeedList />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-8 mt-auto bg-white dark:bg-neutral-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎃</span>
              <div>
                <p className="font-semibold text-neutral-900 dark:text-neutral-50">
                  {APP_CONFIG.name}
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  {APP_CONFIG.description.split(' ').slice(0, 3).join(' ')}
                </p>
              </div>
            </div>
            
            <div className="text-sm text-neutral-600 dark:text-neutral-400 text-center md:text-right">
              <p>{APP_CONFIG.copyright}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
