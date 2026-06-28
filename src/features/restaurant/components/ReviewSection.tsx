import StarRating from '@/components/ui/starRating';
import type { ReviewItem } from '../type';
import ReviewCard from './ReviewCard';

interface ReviewSectionProps {
  reviews: ReviewItem[];
  averageRating: number;
  totalReviews: number;
  hasMore: boolean;
  isFetching: boolean;
  onShowMore: () => void;
}

// Review list with average rating summary and show more button.
export default function ReviewSection({
  reviews,
  averageRating,
  totalReviews,
  hasMore,
  isFetching,
  onShowMore,
}: ReviewSectionProps) {
  return (
    <section className='flex flex-col gap-4'>
      <h2 className='text-[24px] font-extrabold leading-9 md:text-[36px] md:leading-11'>
        Review
      </h2>

      <div className='flex items-center gap-1'>
        <StarRating rating={averageRating} />
        <span className='text-[14px] text-neutral-500 md:text-[16px]'>
          ({totalReviews} reviews)
        </span>
      </div>

      <div className='flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-x-5 md:gap-y-5'>
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      <div className='mb-13 flex w-full items-center justify-center pb-4 md:pb-0'>
        <button
          disabled={!hasMore || isFetching}
          onClick={onShowMore}
          className={`h-10 w-40 rounded-[100px] text-[14px] font-bold leading-7 ring-1 ring-inset ring-neutral-300 -tracking-[0.02em] ${
            !hasMore || isFetching
              ? 'cursor-not-allowed text-neutral-400'
              : 'cursor-pointer text-neutral-950'
          }`}
        >
          {!hasMore ? 'No More Data' : isFetching ? 'Loading...' : 'Show More'}
        </button>
      </div>
    </section>
  );
}
