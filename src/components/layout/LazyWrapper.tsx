import { Suspense, type ReactNode } from 'react';

interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// Wraps lazy-loaded content with a configurable Suspense fallback.
export default function LazyWrapper({
  children,
  fallback = null,
}: LazyWrapperProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
