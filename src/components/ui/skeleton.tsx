import { cn } from '@/lib/utils';

interface SkeletonProps extends React.ComponentProps<'div'> {
  variant?: 'circle' | 'text' | 'rectangular';
}

function Skeleton({
  className,
  variant = 'rectangular',
  ...props
}: SkeletonProps) {
  return (
    <div
      data-slot='skeleton'
      className={cn(
        'animate-pulse bg-muted',
        variant === 'circle' && 'rounded-full aspect-square',
        variant === 'text' && 'rounded-md h-4 w-full',
        variant === 'rectangular' && 'rounded-md',
        className,
      )}
      {...props}
    />
  );
}

function CartSkeleton() {
  return (
    <>
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className='flex flex-col gap-3 rounded-3xl px-4 py-4 shadow-sm md:gap-5'
        >
          <div className='flex flex-row items-center gap-2'>
            <Skeleton variant='circle' className='h-8 w-8' />
            <Skeleton variant='text' className='w-40' />
          </div>
          {Array.from({ length: 2 }).map((_, j) => (
            <div key={j} className='flex flex-row justify-between'>
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
          <Skeleton className='h-10 w-full rounded-full' />
        </div>
      ))}
    </>
  );
}

export { Skeleton, CartSkeleton };
