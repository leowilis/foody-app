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

      <button
        onClick={onShare}
        className='flex h-fit w-fit cursor-pointer flex-row items-center justify-center gap-3 rounded-[100px] p-3 ring-1 ring-inset ring-neutral-300 transition-transform duration-200 hover:scale-[1.05] md:h-11 md:w-35 md:px-4 md:py-3'
        aria-label='Share restaurant'
      >
        <img src='/images/common/share.svg' alt='' className='h-5 w-5' />
        <span className='hidden text-neutral-950 md:block'>Share</span>
      </button>
    </div>
  );
}
