import { formatRupiah } from '@/lib/format';
import type { CartGroupItem } from '../types';

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
    <div className='flex items-center justify-between border-b border-neutral-100 py-2 last:border-0'>
      {/* Product information */}
      <div className='flex min-w-0 items-center gap-4'>
        <div
          role='img'
          aria-label={item.menu.foodName}
          className='h-16 w-16 shrink-0 rounded-2xl bg-cover bg-center bg-no-repeat md:h-20 md:w-20'
          style={{
            backgroundImage: `url('${item.menu.image}')`,
          }}
        />

        <div className='flex min-w-0 flex-col justify-center'>
          <span className='truncate text-sm font-medium leading-7 -tracking-[0.03em] md:text-base'>
            {item.menu.foodName}
          </span>

          <span className='text-base font-extrabold leading-relaxed -tracking-[0.02em] text-neutral-900 md:text-lg'>
            {formatRupiah(item.menu.price)}
          </span>
        </div>
      </div>

      {/* Quantity controls */}
      <div
        className='ml-4 flex shrink-0 items-center gap-4'
        aria-label={quantityLabel}
      >
        <button
          type='button'
          aria-label={`Decrease ${quantityLabel}`}
          onClick={onDecrease}
          disabled={isPending}
          className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-full ring-1 ring-inset ring-neutral-300 disabled:cursor-not-allowed disabled:opacity-50 md:h-10 md:w-10'
        >
          <img
            src='/images/common/minus.svg'
            alt=''
            aria-hidden='true'
            className='h-5 w-5 md:h-6 md:w-6'
          />
        </button>

        <span
          aria-live='polite'
          className='min-w-6 text-center text-[16px] font-bold leading-none -tracking-[0.02em] text-neutral-800 md:text-[18px]'
        >
          {item.quantity}
        </span>

        <button
          type='button'
          aria-label={`Increase ${quantityLabel}`}
          onClick={onIncrease}
          disabled={isPending}
          className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary-100 hover:bg-primary-200 disabled:cursor-not-allowed disabled:opacity-50 md:h-10 md:w-10'
        >
          <img
            src='/images/common/plus.svg'
            alt=''
            aria-hidden='true'
            className='h-5 w-5 md:h-6 md:w-6'
          />
        </button>
      </div>
    </div>
  );
}
