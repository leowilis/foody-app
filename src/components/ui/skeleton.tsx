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

export { Skeleton };
