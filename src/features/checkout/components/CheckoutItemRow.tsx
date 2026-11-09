import foodPlaceholder from '@/assets/details-dummy-1.svg';
import minusIcon from '@/assets/minus.svg';
import plusIcon from '@/assets/plus.svg';
import { formatRupiah } from '@/lib/format';
import type { CheckoutCartItem } from '../types';

interface CheckoutItemRowProps {
  item: CheckoutCartItem;
  isPending: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
}

// Renders a checkout item with quantity controls.
export default function CheckoutItemRow({
  item,
  isPending,
  onIncrease,
  onDecrease,
}: CheckoutItemRowProps) {
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
          <span className='truncate text-sm font-medium leading-7 -tracking-[0.03em] text-text md:text-base md:leading-7.5'>
            {item.menu.foodName}
          </span>

          <span className='text-base font-extrabold leading-7.5 -tracking-[0.02em] text-text md:text-lg md:leading-8'>
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
          onClick={onDecrease}
          disabled={isPending}
          aria-label={`Decrease ${quantityLabel}`}
          className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border-strong bg-surface-subtle text-text transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:h-10 md:w-10'
        >
          <img
            src={minusIcon}
            alt=''
            aria-hidden='true'
            className='h-5 w-5 md:h-6 md:w-6'
          />
        </button>

        <span
          aria-live='polite'
          className='min-w-6 text-center text-base font-bold leading-none -tracking-[0.02em] text-text md:text-lg'
        >
          {item.quantity}
        </span>

        <button
          type='button'
          onClick={onIncrease}
          disabled={isPending}
          aria-label={`Increase ${quantityLabel}`}
          className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary-100 text-primary-foreground transition-colors hover:bg-primary-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:h-10 md:w-10'
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
