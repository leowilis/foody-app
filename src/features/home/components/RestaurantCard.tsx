import { MapPin, Star } from 'lucide-react';
import { useState } from 'react';
import type { RecommendedItem } from '../types';

interface RestaurantCardProps {
  item: RecommendedItem;
  onClick: () => void;
}

export default function RestaurantCard({ item, onClick }: RestaurantCardProps) {
  const [imageError, setImageError] = useState(false);
  const image =
    !imageError && item.images?.[0]
      ? item.images[0]
      : item.logo || '/assets/restaurant-dummy.svg';

  return (
    <button
      type='button'
      onClick={onClick}
      aria-label={`View details for ${item.name}, ${item.category} restaurant located in ${item.place}`}
      className='group flex w-full cursor-pointer flex-col overflow-hidden rounded-[28px] border border-neutral-200/80 bg-white text-left shadow-[0_6px_24px_rgba(0,0,0,0.045)] outline-none transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_16px_40px_rgba(0,0,0,0.09)] focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:ring-offset-2'
    >
      {/* Image Canvas Bounding Container */}
      <div className='relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 shrink-0'>
        <img
          src={image}
          alt=''
          loading='lazy'
          onError={() => setImageError(true)}
          className='h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]'
        />

        {/* Shadow Linear Gradient Overlay */}
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-70'
        />

        {/* Floating Category Indicator */}
        <div className='absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 shadow-sm backdrop-blur-sm'>
          <span className='text-[11px] font-extrabold uppercase tracking-[0.12em] text-neutral-800 leading-none block'>
            {item.category}
          </span>
        </div>

        {/* Dynamic Condition Status Banner Tag */}
        {item.isFrequentlyOrdered && (
          <div className='absolute bottom-4 left-4 rounded-full bg-neutral-950/90 px-3 py-1.5 backdrop-blur-sm'>
            <span className='text-[11px] font-bold text-white leading-none block'>
              Frequently ordered
            </span>
          </div>
        )}
      </div>

      {/* Text Details Information Module */}
      <div className='flex min-w-0 flex-col gap-2.5 p-4 sm:p-5 w-full'>
        <div className='flex items-start justify-between gap-3 w-full'>
          <h3 className='min-w-0 truncate text-[17px] font-black tracking-tight text-neutral-950'>
            {item.name}
          </h3>

          <span className='flex shrink-0 items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-extrabold text-neutral-900'>
            <Star
              aria-hidden='true'
              className='h-3.5 w-3.5 fill-orange-400 text-orange-400'
            />

            {item.star.toFixed(1)}
          </span>
        </div>

        {/* Location & Distance Track row */}
        <div className='flex min-w-0 items-center gap-1.5 text-sm text-neutral-500'>
          <MapPin
            aria-hidden='true'
            className='h-3.5 w-3.5 shrink-0 text-neutral-400'
          />
          <span className='truncate'>{item.place}</span>

          {item.distance !== undefined && (
            <>
              <span
                aria-hidden='true'
                className='shrink-0 text-neutral-300 font-bold'
              >
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
