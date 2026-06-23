import StarRating from '@/components/ui/starRating';
import type { RecommendedItem } from '../types';

interface RestaurantCardProps {
  item: RecommendedItem;
  onClick: () => void;
}

// Single restaurant card shown in the home and category lists.
export default function RestaurantCard({ item, onClick }: RestaurantCardProps) {
  return (
    <div
      className='flex flex-row items-center gap-3 rounded-3xl px-3 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-transform duration-200 hover:scale-[1.05] cursor-pointer md:gap-3 md:px-4 md:py-4'
      onClick={onClick}
    >
      {/* Logo */}
      <img
        src={item.logo || '/assets/restaurant-dummy.svg'}
        alt={item.name}
        className='h-22.5 w-22.5 rounded-2xl object-cover md:h-30 md:w-30'
      />
      {/* Info */}
      <div className='flex flex-1 flex-col items-start gap-0.5 min-w-0'>
        <h3 className='truncate text-[15px] font-bold text-neutral-950 -tracking-[0.02em] md:text-[18px] md:leading-8'>
          {item.name}
        </h3>
        <StarRating rating={item.star} />
        <div className='flex items-center gap-1 text-[13px] text-neutral-500'>
          <span className='truncate text-[13px] text-neutral-500'>
            {item.place}
          </span>
          {item.distance && (
            <>
              <span>·</span>
              <span className='flex-shrink-0 text-neutral-500'>
                {item.distance} km
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
