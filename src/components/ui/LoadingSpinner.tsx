import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingSpinner({
  className,
  size = 'md',
  text,
  ...props
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={cn('flex flex-col items-center gap-3', className)} {...props}>
      <div
        className={cn(
          'border-halloween-orange border-t-transparent rounded-full animate-spin',
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{text}</p>
      )}
    </div>
  );
}
