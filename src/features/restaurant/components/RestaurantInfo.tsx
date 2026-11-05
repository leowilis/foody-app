import { Share2 } from 'lucide-react';
import burgerKingLogo from '@/assets/burger-king-round.svg';
import FavoriteButton from '@/features/favorites/components/FavoriteButton';
import StarRating from '@/components/ui/starRating';
import type { RestaurantDetail } from '../schemas/restaurantSchema';

interface RestaurantInfoProps {
  detail: RestaurantDetail;
  onShare: () => void;
}

// Displays restaurant identity, rating, location, category, and sharing action.
export default function RestaurantInfo({
  detail,
  onShare,
}: RestaurantInfoProps) {
  const logo = detail.logo || burgerKingLogo;

  return (
    <div className='flex flex-row items-center justify-between'>
      <div className='flex min-w-0 flex-row gap-2'>
        <img
          src={logo}
          alt={detail.name}
          decoding='async'
          className='h-22.5 w-22.5 shrink-0 rounded-full object-cover md:h-30 md:w-30'
        />

        <div className='flex min-w-0 flex-col justify-center gap-0.5 md:gap-1'>
          <h1 className='truncate text-[16px] font-extrabold leading-7.5 text-text -tracking-[0.02em] md:text-[32px] md:leading-10.5'>
            {detail.name}
          </h1>

          {/* Show the restaurant rating. */}
          <StarRating rating={detail.star} />

          {/* Show the restaurant location and category. */}
          <div className='flex min-w-0 flex-row items-center gap-1.5'>
            <span className='truncate text-[14px] leading-7 text-text -tracking-[0.02em] md:text-[18px] md:leading-8'>
              {detail.place}
            </span>

            <span
              aria-hidden='true'
              className='h-1 w-1 shrink-0 rounded-full bg-text-muted'
            />

            <span className='truncate text-[14px] leading-7 text-text -tracking-[0.02em] md:text-[18px] md:leading-8'>
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
