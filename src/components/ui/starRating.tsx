import Star from '@/assets/star.svg';

interface StarRatingProps {
  rating: number;
  className?: string;
}

// Displays a star icon alongside a numeric rating.
export default function StarRating({ rating, className }: StarRatingProps) {
  return (
    <div className={`flex items-center gap-1 ${className ?? ''}`}>
      <img src={Star} alt='' className='h-5 w-5' />
      <span className='text-[14px] font-medium leading-7 text-neutral-950 -tracking-[0.03em] md:text-[16px] md:leading-7.5'>
        {rating}
      </span>
    </div>
  );
}
