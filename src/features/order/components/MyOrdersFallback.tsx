import { Skeleton } from '@/components/ui/skeleton';

// Displays a loading placeholder while the My Orders page loads.
export default function MyOrdersFallback() {
  return (
    <div
      role='status'
      aria-label='Loading orders'
      aria-live='polite'
      className='space-y-6'
    >
      <Skeleton className='h-8 w-40' />

      <div className='flex gap-3'>
        <Skeleton className='h-9 w-20' />
        <Skeleton className='h-9 w-24' />
        <Skeleton className='h-9 w-24' />
      </div>

      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className='space-y-4 rounded-xl border border-border p-5'
        >
          <Skeleton className='h-5 w-32' />
          <Skeleton className='h-4 w-48' />
          <Skeleton className='h-20 w-full' />
          <Skeleton className='h-4 w-36' />
        </div>
      ))}
    </div>
  );
}
