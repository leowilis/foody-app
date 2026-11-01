import { Skeleton } from '@/components/ui/skeleton';

// Displays the loading state for restaurant cart groups.
export default function CartSkeleton() {
  return (
    <>
      {Array.from({ length: 2 }).map((_, groupIndex) => (
        <div
          key={groupIndex}
          className='flex flex-col gap-3 rounded-3xl border border-border bg-surface px-4 py-4 shadow-foody-md md:gap-5'
        >
          {/* Restaurant header */}
          <div className='flex flex-row items-center gap-2'>
            <Skeleton variant='circle' className='h-8 w-8' />
            <Skeleton variant='text' className='w-40' />
          </div>

          {/* Cart item placeholders */}
          <div className='flex flex-col gap-3'>
            {Array.from({ length: 2 }).map((_, itemIndex) => (
              <div
                key={itemIndex}
                className='flex flex-row items-center justify-between border-b border-border py-3 last:border-0'
              >
                <div className='flex min-w-0 flex-row gap-3 md:gap-4'>
                  <Skeleton className='h-16 w-16 shrink-0 rounded-2xl md:h-20 md:w-20' />

                  <div className='flex min-w-0 flex-col justify-center gap-2'>
                    <Skeleton variant='text' className='w-32' />
                    <Skeleton variant='text' className='w-24' />
                  </div>
                </div>

                <Skeleton className='h-9 w-24 shrink-0 rounded-pill md:h-10' />
              </div>
            ))}
          </div>

          {/* Cart subtotal */}
          <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
            <div className='flex flex-col gap-1'>
              <Skeleton variant='text' className='w-12' />
              <Skeleton variant='text' className='w-28' />
            </div>

            {/* Checkout placeholder */}
            <Skeleton className='h-11 w-full rounded-pill md:h-12 md:w-60' />
          </div>
        </div>
      ))}
    </>
  );
}
