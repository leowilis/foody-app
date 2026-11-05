import StarRating from '@/components/ui/starRating';
import type { ReviewItem } from '../schemas/restaurantSchema';
import ReviewCard from './ReviewCard';

interface ReviewSectionProps {
  reviews: ReviewItem[];
  averageRating: number;
  totalReviews: number;
  hasMore: boolean;
  isFetching: boolean;
  onShowMore: () => void;
}

// Displays the restaurant review summary, review cards, and pagination controls.
export default function ReviewSection({
  reviews,
  averageRating,
  totalReviews,
  hasMore,
  isFetching,
  onShowMore,
}: ReviewSectionProps) {
  const isShowMoreDisabled = !hasMore || isFetching;

  return (
    <section
      aria-labelledby='restaurant-reviews-title'
      className='flex flex-col gap-4'
    >
      <h2
        id='restaurant-reviews-title'
        className='text-[24px] font-extrabold leading-9 text-text md:text-[36px] md:leading-11'
      >
        Review
      </h2>

      {/* Show the average rating and total review count. */}
      <div
        className='flex items-center gap-1'
        aria-label={`${averageRating} out of 5 stars from ${totalReviews} reviews`}
      >
        <StarRating rating={averageRating} />

        <span className='text-[14px] text-text-secondary md:text-[16px]'>
          ({totalReviews} reviews)
        </span>
      </div>

      {/* Render customer reviews in a responsive layout. */}
      <div className='flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-x-5 md:gap-y-5'>
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Load additional reviews when available. */}
      <div className='mb-13 flex w-full items-center justify-center pb-4 md:pb-0'>
        <button
          type='button'
          disabled={isShowMoreDisabled}
          onClick={onShowMore}
          className={`h-10 w-40 rounded-pill text-[14px] font-bold leading-7 -tracking-[0.02em] ring-1 ring-inset ring-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            isShowMoreDisabled
              ? 'cursor-not-allowed text-text-muted'
              : 'cursor-pointer text-text transition-colors hover:bg-surface-subtle'
          }`}
        >
          {!hasMore ? 'No More Data' : isFetching ? 'Loading...' : 'Show More'}
        </button>
      </div>
    </section>
  );
}
