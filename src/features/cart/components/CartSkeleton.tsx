import { Skeleton } from '@/components/ui/skeleton';

// Displays the loading state for restaurant cart groups.
export default function CartSkeleton() {
  return (
    <>
      {Array.from({
        length: 2,
      }).map((_, groupIndex) => (
        <div
          key={groupIndex}
          className='flex flex-col gap-3 rounded-3xl px-4 py-4 shadow-sm md:gap-5'
        >
          {/* Restaurant header */}
          <div className='flex flex-row items-center gap-2'>
            <Skeleton variant='circle' className='h-8 w-8' />

            <Skeleton variant='text' className='w-40' />
          </div>

          {/* Cart item placeholders */}
          {Array.from({
            length: 2,
          }).map((_, itemIndex) => (
            <div key={itemIndex} className='flex flex-row justify-between'>
              <div className='flex flex-row gap-4'>
                <Skeleton className='h-16 w-16 rounded-2xl md:h-20 md:w-20' />
                <div className='flex flex-col justify-center gap-2'>
                  <Skeleton variant='text' className='w-32' />
                  <Skeleton variant='text' className='w-24' />
                </div>
              </div>
              <Skeleton className='h-9 w-24 rounded-full' />
            </div>
          ))}

          {/* Checkout placeholder */}
          <Skeleton className='h-10 w-full rounded-full' />
        </div>
      ))}
    </>
  );
}
