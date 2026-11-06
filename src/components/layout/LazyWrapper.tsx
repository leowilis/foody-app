import { Suspense, type ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

function DefaultFallback() {
  return (
    <div
      role='status'
      aria-label='Loading page'
      aria-live='polite'
      className='space-y-6 p-4 sm:p-6'
    >
      <Skeleton className='h-8 w-48' />
      <Skeleton className='h-4 w-64' />
      <Skeleton className='h-48 w-full rounded-2xl' />
    </div>
  );
}

// Wraps lazy-loaded content with a configurable Suspense fallback.
export default function LazyWrapper({ children, fallback }: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback ?? <DefaultFallback />}>{children}</Suspense>
  );
}
