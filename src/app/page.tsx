import Header from '@/components/shared/Header';
import FeedList from '@/components/shared/FeedList';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Tailwind Test Banner */}
      <div className="bg-primary-500 text-white p-4 text-center font-bold text-xl">
        🎉 Tailwind CSS v4 is Working! 🎉
      </div>
      
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2 text-neutral-900 dark:text-neutral-50">
            Welcome to RSS Renaissance
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Resurrect your RSS feeds with AI-powered intelligence
          </p>
        </div>

        {/* Tailwind Test Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-halloween-orange text-white p-6 rounded-xl shadow-lg">
            <h3 className="font-bold text-lg mb-2">Halloween Orange</h3>
            <p className="text-sm">Custom theme color working!</p>
          </div>
          <div className="bg-halloween-purple text-white p-6 rounded-xl shadow-lg">
            <h3 className="font-bold text-lg mb-2">Halloween Purple</h3>
            <p className="text-sm">Custom theme color working!</p>
          </div>
          <div className="bg-halloween-green text-white p-6 rounded-xl shadow-lg">
            <h3 className="font-bold text-lg mb-2">Halloween Green</h3>
            <p className="text-sm">Custom theme color working!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content area */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-neutral-50">
                Recent Articles
              </h2>
              <div className="space-y-4">
                {/* Placeholder for articles */}
                <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-2 rounded-full bg-halloween-orange"></div>
                    <div className="flex-1">
                      <h3 className="font-medium text-neutral-900 dark:text-neutral-50 mb-1">
                        Add your first RSS feed to get started
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Click the "Add Feed" button to subscribe to your favorite blogs and news
                        sources. We'll automatically deduplicate and summarize articles for you.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FeedList />
          </div>
        </div>
      </main>

      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-neutral-600 dark:text-neutral-400">
          <p>RSS Renaissance &copy; 2025 - Built with ❤️ and AI</p>
        </div>
      </footer>
    </div>
  );
}
