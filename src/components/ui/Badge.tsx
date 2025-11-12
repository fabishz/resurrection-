import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'orange' | 'purple' | 'green' | 'neutral';
  children: React.ReactNode;
}

export default function Badge({ className, variant = 'neutral', children, ...props }: BadgeProps) {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

  const variantClasses = {
    orange: 'bg-halloween-orange/10 text-halloween-orange',
    purple: 'bg-halloween-purple/10 text-halloween-purple',
    green: 'bg-halloween-green/10 text-halloween-green',
    neutral: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300',
  };

  return (
    <span className={cn(baseClasses, variantClasses[variant], className)} {...props}>
      {children}
    </span>
  );
}
