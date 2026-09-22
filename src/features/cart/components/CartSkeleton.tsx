import { Skeleton } from '@/components/ui/skeleton';

const SKELETON_GROUP_COUNT = 2;
const SKELETON_ITEM_COUNT = 2;

// Displays loading placeholders for grouped cart items.
export default function CartSkeleton() {
  return (
    <>
      {Array.from({ length: SKELETON_GROUP_COUNT }).map((_, groupIndex) => (
        <div
          key={`cart-group-skeleton-${groupIndex}`}
          className='flex flex-col gap-3 rounded-3xl px-4 py-4 shadow-sm md:gap-5'
        >
          {/* Restaurant header */}
          <div className='flex flex-row items-center gap-2'>
            <Skeleton variant='circle' className='h-8 w-8' />
            <Skeleton variant='text' className='w-40' />
          </div>

          {/* Cart items */}
          {Array.from({ length: SKELETON_ITEM_COUNT }).map((_, itemIndex) => (
            <div
              key={`cart-item-skeleton-${groupIndex}-${itemIndex}`}
              className='flex flex-row items-center justify-between'
            >
              <div className='flex min-w-0 flex-row gap-4'>
                <Skeleton className='h-16 w-16 shrink-0 rounded-2xl md:h-20 md:w-20' />
                <div className='flex min-w-0 flex-col justify-center gap-2'>
                  <Skeleton variant='text' className='w-32' />
                  <Skeleton variant='text' className='w-24' />
                </div>
              </div>
              <Skeleton className='h-9 w-24 shrink-0 rounded-full' />
            </div>
          ))}

          {/* Cart subtotal and checkout */}
          <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
            <div className='flex flex-col gap-1'>
              <Skeleton variant='text' className='w-14' />
              <Skeleton variant='text' className='w-24' />
            </div>
            <Skeleton className='h-11 w-full rounded-full md:h-12 md:w-60' />
          </div>
        </div>
      ))}
    </>
  );
}
