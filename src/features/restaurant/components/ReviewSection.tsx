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

/**
 * Displays the restaurant review section with an average rating summary,
 * review cards, and pagination controls for loading additional reviews.
 */
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
      {/* Review section */}
      <h2
        id='restaurant-reviews-title'
        className='text-[24px] font-extrabold leading-9 md:text-[36px] md:leading-11'
      >
        Review
      </h2>

      {/* Average rating and total review count */}
      <div
        className='flex items-center gap-1'
        aria-label={`${averageRating} out of 5 stars from ${totalReviews} reviews`}
      >
        <StarRating rating={averageRating} />

        <span className='text-[14px] text-neutral-500 md:text-[16px]'>
          ({totalReviews} reviews)
        </span>
      </div>

      {/* Customer review cards */}
      <div className='flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-x-5 md:gap-y-5'>
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      <div className='mb-13 flex w-full items-center justify-center pb-4 md:pb-0'>
        {/* Load more reviews button */}
        <button
          type='button'
          disabled={isShowMoreDisabled}
          onClick={onShowMore}
          className={`h-10 w-40 rounded-[100px] text-[14px] font-bold leading-7 ring-1 ring-inset ring-neutral-300 -tracking-[0.02em] ${
            isShowMoreDisabled
              ? 'cursor-not-allowed text-neutral-400'
              : 'cursor-pointer text-neutral-950 transition-colors hover:bg-neutral-100'
          }`}
        >
          {!hasMore ? 'No More Data' : isFetching ? 'Loading...' : 'Show More'}
        </button>
      </div>
    </section>
  );
}
