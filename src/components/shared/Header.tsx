'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { APP_CONFIG } from '@/config/app';

export default function Header() {
  const { theme, toggleTheme, mounted } = useTheme();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-900/95 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Icon name="rss" variant="solid" size="lg" className="text-halloween-orange dark:text-halloween-purple" />
            <div>
              <h1 className="text-xl font-semibold text-white">
                {APP_CONFIG.name}
              </h1>
              <p className="text-xs text-neutral-400">
                {APP_CONFIG.description.split(' ').slice(0, 3).join(' ')}
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {APP_CONFIG.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive(item.href)
                    ? 'bg-halloween-orange text-white'
                    : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="primary" aria-label="Add new feed" className="hidden sm:flex">
              <Icon name="plus" size="sm" className="mr-2" />
              Add Feed
            </Button>

            <Button variant="primary" aria-label="Add new feed" className="sm:hidden">
              <Icon name="plus" size="md" />
            </Button>

            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-neutral-800 transition-colors duration-150"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <Icon name="sun" className="text-neutral-400 hover:text-white" />
                ) : (
                  <Icon name="moon" className="text-neutral-400 hover:text-white" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
