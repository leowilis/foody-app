import { Skeleton } from '@/components/ui/skeleton';

export default function RestaurantCardSkeleton() {
  return (
    <div className='flex flex-col gap-3 p-4 border border-neutral-100 rounded-2xl w-full'>
      {/* Restaurant Thumbnail */}
      <Skeleton className='h-40 w-full rounded-xl' />

      <div className='flex flex-col gap-2'>
        {/* Restaurant Name */}
        <Skeleton className='h-6 w-3/4 rounded' />

        {/* Rating & Distance */}
        <div className='flex gap-2'>
          <Skeleton className='h-4 w-12 rounded' />
          <Skeleton className='h-4 w-16 rounded' />
        </div>
      </div>
    </div>
  );
}
