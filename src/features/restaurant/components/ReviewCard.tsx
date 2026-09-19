import StarRating from '@/components/ui/starRating';
import { formatDate } from '@/lib/format';
import type { ReviewItem } from '../schemas/restaurantSchema';

interface ReviewCardProps {
  review: ReviewItem;
}

// Displays a review with its author, date, rating, and comment.
export default function ReviewCard({ review }: ReviewCardProps) {
  const avatar = review.user.avatar || '/images/common/profile-dummy.svg';

  return (
    <article className='flex flex-col gap-4 rounded-3xl px-4 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.08)]'>
      <div className='flex flex-row gap-3'>
        <img
          src={avatar}
          alt={review.user.name}
          loading='lazy'
          className='h-14 w-14 shrink-0 rounded-full object-cover md:h-16 md:w-16'
        />

        <div className='flex min-w-0 flex-col justify-center'>
          <h3 className='truncate text-[16px] font-extrabold leading-7.5 -tracking-[0.02em] md:text-[18px] md:leading-8'>
            {review.user.name}
          </h3>

          <p className='text-[14px] leading-7 -tracking-[0.02em] text-neutral-500 md:text-[16px] md:leading-7.5'>
            {formatDate(review.createdAt)}
          </p>
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <StarRating rating={Number(review.star)} />

        <p className='text-[14px] leading-7 -tracking-[0.02em] md:text-[16px] md:leading-7.5'>
          {review.comment}
        </p>
      </div>
    </article>
  );
}
