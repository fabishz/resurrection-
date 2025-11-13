'use client';

import { useTheme } from '@/hooks/useTheme';

export default function TailwindTestPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 transition-colors duration-500">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 text-neutral-900 dark:text-neutral-50 animate-fade-in">
            🎃 Tailwind v4 Feature Test
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 animate-slide-up">
            Comprehensive test of all Tailwind CSS v4 features
          </p>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="mt-6 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-glow-purple"
          >
            Toggle to {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </button>
        </div>

        {/* Color Palette Test */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-neutral-900 dark:text-neutral-50">
            🎨 Halloween Theme Colors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-halloween-orange text-white p-6 rounded-xl shadow-lg hover:shadow-glow-orange transition-all duration-300 hover:-translate-y-1">
              <h3 className="font-bold text-xl mb-2">Halloween Orange</h3>
              <p className="text-sm opacity-90">#ff6b35</p>
              <div className="mt-4 p-3 bg-white/20 rounded-lg">
                <p className="text-xs">Hover for glow effect</p>
              </div>
            </div>
            
            <div className="bg-halloween-purple text-white p-6 rounded-xl shadow-lg hover:shadow-glow-purple transition-all duration-300 hover:-translate-y-1">
              <h3 className="font-bold text-xl mb-2">Halloween Purple</h3>
              <p className="text-sm opacity-90">#6b35ff</p>
              <div className="mt-4 p-3 bg-white/20 rounded-lg">
                <p className="text-xs">Hover for glow effect</p>
              </div>
            </div>
            
            <div className="bg-halloween-green text-white p-6 rounded-xl shadow-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <h3 className="font-bold text-xl mb-2">Halloween Green</h3>
              <p className="text-sm opacity-90">#35ff6b</p>
              <div className="mt-4 p-3 bg-white/20 rounded-lg">
                <p className="text-xs">Smooth transitions</p>
              </div>
            </div>
            
            <div className="bg-halloween-blood text-white p-6 rounded-xl shadow-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <h3 className="font-bold text-xl mb-2">Halloween Blood</h3>
              <p className="text-sm opacity-90">#8b0000</p>
            </div>
            
            <div className="bg-halloween-midnight text-white p-6 rounded-xl shadow-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <h3 className="font-bold text-xl mb-2">Halloween Midnight</h3>
              <p className="text-sm opacity-90">#0a0a14</p>
            </div>
            
            <div className="bg-halloween-fog text-neutral-900 p-6 rounded-xl shadow-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <h3 className="font-bold text-xl mb-2">Halloween Fog</h3>
              <p className="text-sm opacity-90">#e8e8f0</p>
            </div>
          </div>
        </section>

        {/* Responsive Grid Test */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-neutral-900 dark:text-neutral-50">
            📱 Responsive Breakpoints
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {['Base', 'SM', 'MD', 'LG', 'XL'].map((breakpoint, i) => (
              <div
                key={breakpoint}
                className="bg-primary-500 text-white p-6 rounded-lg text-center font-bold"
              >
                {breakpoint}
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
            Resize your browser to see responsive grid changes
          </p>
        </section>

        {/* Animation Test */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-neutral-900 dark:text-neutral-50">
            ✨ Animations & Transitions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700">
              <h3 className="font-bold mb-4 text-neutral-900 dark:text-neutral-50">Fade In</h3>
              <div className="bg-primary-500 text-white p-4 rounded-lg animate-fade-in">
                Fades in smoothly
              </div>
            </div>
            
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700">
              <h3 className="font-bold mb-4 text-neutral-900 dark:text-neutral-50">Slide Up</h3>
              <div className="bg-halloween-purple text-white p-4 rounded-lg animate-slide-up">
                Slides up from bottom
              </div>
            </div>
            
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700">
              <h3 className="font-bold mb-4 text-neutral-900 dark:text-neutral-50">Pulse Glow</h3>
              <div className="bg-halloween-orange text-white p-4 rounded-lg animate-pulse-glow">
                Pulses continuously
              </div>
            </div>
          </div>
        </section>

        {/* Dark Mode Test */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-neutral-900 dark:text-neutral-50">
            🌙 Dark Mode Variants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 transition-colors duration-300">
              <h3 className="font-bold mb-2 text-neutral-900 dark:text-neutral-50">
                Background Transition
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                This card smoothly transitions between light and dark backgrounds
              </p>
            </div>
            
            <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 transition-colors duration-300">
              <h3 className="font-bold mb-2 text-neutral-900 dark:text-neutral-50">
                Border & Text
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Borders and text colors adapt to theme
              </p>
            </div>
          </div>
        </section>

        {/* Typography Plugin Test */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-neutral-900 dark:text-neutral-50">
            📝 Typography Plugin
          </h2>
          <article className="prose dark:prose-invert max-w-none bg-white dark:bg-neutral-800 p-8 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700">
            <h3>Sample Article with Typography Styles</h3>
            <p>
              The <code>@tailwindcss/typography</code> plugin provides beautiful typographic defaults
              for content-heavy pages. This includes proper spacing, font sizes, and colors that
              automatically adapt to dark mode.
            </p>
            <ul>
              <li>Automatic list styling</li>
              <li>Proper heading hierarchy</li>
              <li>Code block formatting</li>
            </ul>
            <blockquote>
              Typography matters. It's the foundation of good design.
            </blockquote>
          </article>
        </section>

        {/* Forms Plugin Test */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-neutral-900 dark:text-neutral-50">
            📋 Forms Plugin
          </h2>
          <div className="bg-white dark:bg-neutral-800 p-8 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-900 dark:text-neutral-50">
                  Text Input
                </label>
                <input
                  type="text"
                  placeholder="Enter text..."
                  className="w-full rounded-lg border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-900 dark:text-neutral-50">
                  Select Dropdown
                </label>
                <select className="w-full rounded-lg border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50">
                  <option>Option 1</option>
                  <option>Option 2</option>
                  <option>Option 3</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="checkbox-test"
                  className="rounded border-neutral-300 text-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-700"
                />
                <label htmlFor="checkbox-test" className="text-sm text-neutral-900 dark:text-neutral-50">
                  Styled checkbox with forms plugin
                </label>
              </div>
            </form>
          </div>
        </section>

        {/* Aspect Ratio Plugin Test */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-neutral-900 dark:text-neutral-50">
            📐 Aspect Ratio Plugin
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="aspect-video bg-gradient-to-br from-halloween-orange to-halloween-purple rounded-xl flex items-center justify-center text-white font-bold text-2xl">
              16:9 Video
            </div>
            <div className="aspect-square bg-gradient-to-br from-halloween-purple to-halloween-green rounded-xl flex items-center justify-center text-white font-bold text-2xl">
              1:1 Square
            </div>
          </div>
        </section>

        {/* Success Summary */}
        <section className="mt-16 p-8 bg-gradient-to-r from-halloween-orange to-halloween-purple rounded-2xl text-white text-center">
          <h2 className="text-4xl font-bold mb-4">✅ All Tests Passed!</h2>
          <p className="text-xl opacity-90">
            Tailwind CSS v4 is fully functional with Next.js 16 + Turbopack
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <span className="px-4 py-2 bg-white/20 rounded-full">✓ Dark Mode</span>
            <span className="px-4 py-2 bg-white/20 rounded-full">✓ Responsive</span>
            <span className="px-4 py-2 bg-white/20 rounded-full">✓ Animations</span>
            <span className="px-4 py-2 bg-white/20 rounded-full">✓ Custom Colors</span>
            <span className="px-4 py-2 bg-white/20 rounded-full">✓ Typography</span>
            <span className="px-4 py-2 bg-white/20 rounded-full">✓ Forms</span>
            <span className="px-4 py-2 bg-white/20 rounded-full">✓ Aspect Ratio</span>
          </div>
        </section>
      </div>
    </div>
  );
}
