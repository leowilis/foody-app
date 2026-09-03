import { formatRupiah } from '@/lib/format';
import type { CartGroupItem } from './types';

interface CartItemRowProps {
  item: CartGroupItem;
  onIncrease: () => void;
  onDecrease: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

// Single cart item row — image, name, price, and quantity controls.
export default function CartItemRow({
  item,
  onIncrease,
  onDecrease,
  isUpdating,
  isDeleting,
}: CartItemRowProps) {
  return (
    <div className='flex flex-row justify-between items-center py-2 border-b border-neutral-100 last:border-0'>
      <div className='flex flex-row gap-4 items-center'>
        {/* Food Product Media Thumbnail */}
        <div
          className='h-16 w-16 shrink-0 rounded-2xl bg-cover bg-center bg-no-repeat md:h-20 md:w-20'
          style={{ backgroundImage: `url('${item.menu.image}')` }}
        />
        <div className='flex flex-col justify-center'>
          <span className='text-sm font-medium leading-7 -tracking-[0.03em] md:text-base'>
            {item.menu.foodName}
          </span>
          <span className='text-base font-extrabold leading-relaxed -tracking-[0.02em] -tracking-[0.02em] text-neutral-900 md:text-lg'>
            {formatRupiah(item.menu.price)}
          </span>
        </div>
      </div>

      <div className='flex flex-row items-center gap-4'>
        {/* Decrease Quantity Action Button */}
        <button
          type='button'
          aria-label={`Decrease quantity of ${item.menu.foodName}`}
          onClick={onDecrease}
          disabled={isUpdating || isDeleting}
          className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-full ring-1 ring-inset ring-neutral-300 disabled:cursor-not-allowed disabled:opacity-50 md:h-10 md:w-10'
        >
          <img
            src='/images/common/minus.svg'
            alt=''
            className='h-5 w-5 md:h-6 md:w-6'
          />
        </button>
        <span className='min-w-6 text-center text-[16px] font-bold leading-none -tracking-[0.02em] text-neutral-800 md:text-[18px]'>
          {item.quantity}
        </span>

        {/* Increase Quantity Action Button */}
        <button
          type='button'
          onClick={onIncrease}
          disabled={isUpdating}
          aria-label={`Increase quantity of ${item.menu.foodName}`}
          className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary-100 hover:bg-primary-200 disabled:cursor-not-allowed disabled:opacity-50 md:h-10 md:w-10'
        >
          <img
            src='/images/common/plus.svg'
            alt=''
            className='h-5 w-5 md:h-6 md:w-6'
          />
        </button>
      </div>
    </div>
  );
}
