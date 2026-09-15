import { Skeleton } from '@/components/ui/skeleton';

export default function RestaurantCardSkeleton() {
  return (
    <div className='flex w-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm select-none animate-fadeIn'>
      <Skeleton className='aspect-[4/3] w-full rounded-none' />
      <div className='flex flex-col gap-2 p-4'>
        <Skeleton className='h-5 w-3/4 rounded-md' />
        <Skeleton className='h-4 w-1/3 rounded-md' />
        <Skeleton className='h-4 w-2/3 rounded-md' />
      </div>
    </div>
  );
}
