import { Suspense, type ReactNode } from 'react';

// Wraps lazy-loaded components with Suspense fallback.
export default function LazyWrapper({ children }: { children: ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
