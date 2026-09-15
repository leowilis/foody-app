import StarRating from '@/components/ui/starRating';
import type { RecommendedItem } from '../types';

interface RestaurantCardProps {
  item: RecommendedItem;
  onClick: () => void;
}

export default function RestaurantCard({ item, onClick }: RestaurantCardProps) {
  const image = item.logo || '/assets/restaurant-dummy.svg';

  return (
    <button
      type='button'
      onClick={onClick}
      aria-label={`View details for ${item.name} located in ${item.place}`}
      className='group flex w-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white text-left shadow-sm outline-none transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.05)] focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:ring-offset-2'
    >
      {/* Aspect Ratio Media Thumbnail Box */}
      <div className='relative aspect-[4/3] w-full overflow-hidden bg-neutral-300'>
        <img
          src={image}
          alt='' // Intentionally blank as the button's aria-label already explicitly reads the merchant's title
          loading='lazy'
          className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]'
        />
      </div>

      {/* Descriptive Metadata Panel */}
      <div className='flex min-w-0 flex-col gap-1.5 p-4 w-full'>
        <h3 className='truncate text-base font-bold tracking-tight text-neutral-900'>
          {item.name}
        </h3>

        {/* Star Rating Node Row */}
        <StarRating rating={item.star} />

        {/* Location & Distance Track Grid */}
        <div className='flex min-w-0 items-center gap-1.5 text-xs font-semibold text-neutral-500 mt-0.5'>
          <span className='truncate'>{item.place}</span>
          {item.distance !== undefined && (
            <>
              <span aria-hidden='true' className='text-neutral-300 font-bold'>
                ·
              </span>
              <span className='shrink-0 text-neutral-600 font-mono'>
                {item.distance} km
              </span>
            </>
          )}
        </div>
      </div>
    </button>
  );
}
