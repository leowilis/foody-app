import { formatDate } from '@/lib/format';
import type { ReviewItem } from '../type';
import StarRating from '@/components/ui/starRating';

interface ReviewCardProps {
  review: ReviewItem;
}

// Single review card showing user info, star rating, and comment.
export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className='flex flex-col gap-4 rounded-3xl px-4 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.08)]'>
      <div className='flex flex-row gap-3'>
        <div
          className='h-14.5 w-14.5 flex-shrink-0 rounded-full bg-cover bg-center md:h-16 md:w-16'
          style={{
            backgroundImage: `url('${review.user.avatar || '/images/common/profile-dummy.svg'}')`,
          }}
        />
        <div className='flex flex-col'>
          <h3 className='text-[16px] font-extrabold leading-7.5 -tracking-[0.02em] md:text-[18px] md:leading-8'>
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
    </div>
  );
}
