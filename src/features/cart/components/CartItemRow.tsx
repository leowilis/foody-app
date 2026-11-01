import { formatRupiah } from '@/lib/format';
import type { CartGroupItem } from '../types';
import minusIcon from '@/assets/minus.svg';
import plusIcon from '@/assets/plus.svg';
import foodPlaceholder from '@/assets/details-dummy-1.svg';

interface CartItemRowProps {
  item: CartGroupItem;
  onIncrease: () => void;
  onDecrease: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

// Displays a single cart item with its product information and quantity controls.
export default function CartItemRow({
  item,
  onIncrease,
  onDecrease,
  isUpdating,
  isDeleting,
}: CartItemRowProps) {
  const isPending = isUpdating || isDeleting;
  const quantityLabel = `Quantity of ${item.menu.foodName}`;

  return (
    <div className='flex items-center justify-between border-b border-border py-3 last:border-0'>
      {/* Product information */}
      <div className='flex min-w-0 items-center gap-3 md:gap-4'>
        <img
          src={item.menu.image || foodPlaceholder}
          alt={item.menu.foodName}
          loading='lazy'
          decoding='async'
          onError={(event) => {
            const image = event.currentTarget;

            image.onerror = null;
            image.src = foodPlaceholder;
          }}
          className='h-16 w-16 shrink-0 rounded-2xl object-cover md:h-20 md:w-20'
        />

        <div className='flex min-w-0 flex-col justify-center'>
          <span className='truncate text-sm font-medium leading-7 -tracking-[0.03em] text-text md:text-base'>
            {item.menu.foodName}
          </span>

          <span className='text-base font-extrabold leading-relaxed -tracking-[0.02em] text-text md:text-lg'>
            {formatRupiah(item.menu.price)}
          </span>
        </div>
      </div>

      {/* Quantity controls */}
      <div
        role='group'
        aria-label={quantityLabel}
        className='ml-3 flex shrink-0 items-center gap-3 md:ml-4 md:gap-4'
      >
        <button
          type='button'
          aria-label={`Decrease ${quantityLabel}`}
          onClick={onDecrease}
          disabled={isPending}
          className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border-strong bg-surface-subtle text-text transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50 md:h-10 md:w-10'
        >
          <img
            src={minusIcon}
            alt=''
            aria-hidden='true'
            className='h-5 w-5 md:h-6 md:w-6 invert'
          />
        </button>

        <span
          aria-live='polite'
          className='min-w-6 text-center text-[16px] font-bold leading-none -tracking-[0.02em] text-text md:text-[18px]'
        >
          {item.quantity}
        </span>

        <button
          type='button'
          aria-label={`Increase ${quantityLabel}`}
          onClick={onIncrease}
          disabled={isPending}
          className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary-100 text-white transition-colors hover:bg-primary-200 disabled:cursor-not-allowed disabled:opacity-50 md:h-10 md:w-10'
        >
          <img
            src={plusIcon}
            alt=''
            aria-hidden='true'
            className='h-5 w-5 md:h-6 md:w-6'
          />
        </button>
      </div>
    </div>
  );
}
