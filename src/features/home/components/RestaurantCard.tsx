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
      className='flex flex-row items-center gap-2 rounded-3xl px-3 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-transform duration-200 hover:scale-[1.05] cursor-pointer md:gap-3 md:px-4 md:py-4'
      onClick={onClick}
    >
      <img
        src={item.logo || '/assets/restaurant-dummy.svg'}
        alt={item.name}
        className='h-22.5 w-22.5 rounded-2xl object-cover md:h-30 md:w-30'
      />
      <div className='flex w-full flex-col gap-0.5'>
        <h3 className='text-[16px] font-extrabold leading-7.5 text-neutral-950 -tracking-[0.02em] md:text-[18px] md:leading-8'>
          {item.name}
        </h3>
        <StarRating rating={item.star} />
        <span className='text-[14px] leading-7 text-neutral-950 -tracking-[0.02em] md:text-[16px] md:leading-7.5'>
          {item.place}
        </span>
      </div>
    </div>
  );
}
