/**
 * Icon Component Library
 * Centralized icon components using Heroicons
 */

import {
  RssIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  SparklesIcon,
  BoltIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  MoonIcon,
  SunIcon,
  PlusIcon,
  BookmarkIcon,
  ShareIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ChartBarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

import {
  RssIcon as RssSolid,
  HomeIcon as HomeSolid,
  SparklesIcon as SparklesSolid,
} from '@heroicons/react/24/solid';

export type IconName =
  | 'rss'
  | 'home'
  | 'search'
  | 'grid'
  | 'sparkles'
  | 'bolt'
  | 'shield'
  | 'phone'
  | 'moon'
  | 'sun'
  | 'plus'
  | 'bookmark'
  | 'share'
  | 'check'
  | 'error'
  | 'warning'
  | 'info'
  | 'chart'
  | 'document'
  | 'users'
  | 'clock';

export type IconVariant = 'outline' | 'solid';

interface IconProps {
  name: IconName;
  variant?: IconVariant;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

const iconMap = {
  outline: {
    rss: RssIcon,
    home: HomeIcon,
    search: MagnifyingGlassIcon,
    grid: Squares2X2Icon,
    sparkles: SparklesIcon,
    bolt: BoltIcon,
    shield: ShieldCheckIcon,
    phone: DevicePhoneMobileIcon,
    moon: MoonIcon,
    sun: SunIcon,
    plus: PlusIcon,
    bookmark: BookmarkIcon,
    share: ShareIcon,
    check: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
    chart: ChartBarIcon,
    document: DocumentTextIcon,
    users: UserGroupIcon,
    clock: ClockIcon,
  },
  solid: {
    rss: RssSolid,
    home: HomeSolid,
    sparkles: SparklesSolid,
  },
};

export default function Icon({
  name,
  variant = 'outline',
  className = '',
  size = 'md',
}: IconProps) {
  const IconComponent = iconMap[variant][name as keyof typeof iconMap[typeof variant]];

  if (!IconComponent) {
    console.warn(`Icon "${name}" with variant "${variant}" not found`);
    return null;
  }

  return <IconComponent className={`${sizeClasses[size]} ${className}`} />;
}

// Convenience exports for common icons
export const RSSIcon = (props: Omit<IconProps, 'name'>) => <Icon name="rss" {...props} />;
export const HomeIconComponent = (props: Omit<IconProps, 'name'>) => <Icon name="home" {...props} />;
export const SearchIcon = (props: Omit<IconProps, 'name'>) => <Icon name="search" {...props} />;
export const SparklesIconComponent = (props: Omit<IconProps, 'name'>) => <Icon name="sparkles" {...props} />;
