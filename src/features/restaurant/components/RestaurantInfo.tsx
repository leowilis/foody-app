import { Share2 } from 'lucide-react';
import FavoriteButton from '@/features/favorites/components/FavoriteButton';
import StarRating from '@/components/ui/starRating';
import type { RestaurantDetail } from '../type';

interface RestaurantInfoProps {
  detail: RestaurantDetail;
  onShare: () => void;
}

// Restaurant name, logo, rating, location, category, and share button.
export default function RestaurantInfo({
  detail,
  onShare,
}: RestaurantInfoProps) {
  return (
    <div className='flex flex-row items-center justify-between'>
      <div className='flex flex-row gap-2'>
        <img
          src={detail.logo || '/assets/burger-king-round.svg'}
          alt={detail.name}
          className='h-22.5 w-22.5 rounded-full object-cover md:h-30 md:w-30'
        />
        <div className='flex flex-col justify-center gap-0.5 md:gap-1'>
          <h1 className='text-[16px] font-extrabold leading-7.5 text-neutral-950 -tracking-[0.02em] md:text-[32px] md:leading-10.5'>
            {detail.name}
          </h1>
          <StarRating rating={detail.star} />
          <div className='flex flex-row items-center gap-1.5'>
            <span className='text-[14px] leading-7 text-neutral-950 -tracking-[0.02em] md:text-[18px] md:leading-8'>
              {detail.place}
            </span>
            <span className='h-1 w-1 rounded-full bg-neutral-400' />
            <span className='text-[14px] leading-7 text-neutral-950 -tracking-[0.02em] md:text-[18px] md:leading-8'>
              {detail.category}
            </span>
          </div>
        </div>
      </div>

      <div className='flex shrink-0 items-center gap-2'>
        <FavoriteButton restaurantId={detail.id} restaurantName={detail.name} />

        <button
          type='button'
          onClick={onShare}
          aria-label={`Share ${detail.name}`}
          className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-subtle text-white transition-colors hover:border-primary-100 hover:bg-primary-100/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-100'
        >
          <Share2 aria-hidden='true' className='h-5 w-5' />
        </button>
      </div>
    </div>
  );
}
