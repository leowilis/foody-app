import type { MenuItem } from '../schemas/restaurantSchema';
import type { CartHandlers } from '@/features/cart/hooks/useCartHandlers';
import type { CartItem } from '@/features/cart/types';
import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/lib/format';
import detailsPlaceholder from '@/assets/details-dummy-1.webp';
import minusIcon from '@/assets/minus.svg';
import plusIcon from '@/assets/plus.svg';

interface MenuCardProps {
  menu: MenuItem;
  restaurantId: number;
  restaurantName: string;
  cartItems: readonly CartItem[];
  handlers: CartHandlers;
}

// Displays a menu item with cart quantity controls.
export default function MenuCard({
  menu,
  restaurantId,
  restaurantName,
  cartItems,
  handlers,
}: MenuCardProps) {
  const cartItem = cartItems.find((item) => item.menuId === menu.id);
  const qty = cartItem?.qty ?? 0;
  const isPending = handlers.isItemPending(menu.id);

  const actionItem: CartItem = cartItem ?? {
    menuId: menu.id,
    restaurantId,
    restaurantName,
    name: menu.foodName,
    price: menu.price,
    type: menu.type,
    image: menu.image || detailsPlaceholder,
    qty: 0,
  };

  const image = menu.image || detailsPlaceholder;

  return (
    <div className='flex flex-col overflow-hidden rounded-3xl bg-surface shadow-foody-md transition-transform duration-200 hover:scale-[1.02]'>
      <div className='aspect-[4/3] w-full overflow-hidden bg-surface-subtle'>
        <img
          src={image}
          alt={menu.foodName}
          loading='lazy'
          decoding='async'
          className='h-full w-full object-cover'
        />
      </div>

      <div className='flex flex-col gap-4 px-3 py-3 md:flex-row md:justify-between md:px-4 md:py-4'>
        <div className='flex min-w-0 flex-col md:flex-1'>
          <span className='truncate text-[14px] font-medium leading-7 text-text md:text-[16px] md:leading-7 md:-tracking-[0.03em]'>
            {menu.foodName}
          </span>

          <h3 className='text-[16px] font-extrabold leading-7.5 text-text md:text-[18px] md:leading-8 md:-tracking-[0.02em]'>
            {formatRupiah(menu.price)}
          </h3>
        </div>

        <div className='flex items-center justify-center md:flex-1'>
          {qty === 0 ? (
            <Button
              type='button'
              onClick={() => handlers.handleIncrease(actionItem)}
              disabled={isPending}
              className='h-9 w-full cursor-pointer rounded-pill bg-primary-100 text-[14px] font-bold leading-7 text-primary-foreground -tracking-[0.02em] hover:bg-primary-200 disabled:cursor-not-allowed disabled:opacity-50 md:h-10 md:text-[16px] md:leading-7.5'
            >
              {isPending ? 'Adding...' : 'Add'}
            </Button>
          ) : (
            <div
              className='flex flex-row items-center gap-4'
              aria-label={`Quantity of ${menu.foodName}`}
            >
              <button
                type='button'
                aria-label={`Decrease ${menu.foodName} quantity`}
                onClick={() => handlers.handleDecrease(menu.id)}
                disabled={isPending}
                className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-surface-subtle ring-1 ring-inset ring-border-strong transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:h-10 md:w-10'
              >
                <img
                  src={minusIcon}
                  alt=''
                  aria-hidden='true'
                  className='h-5 w-5 md:h-6 md:w-6'
                />
              </button>

              <span className='min-w-5 text-center text-[16px] font-semibold leading-7.5 text-text -tracking-[0.02em] md:text-[18px] md:leading-8'>
                {qty}
              </span>

              <button
                type='button'
                aria-label={`Increase ${menu.foodName} quantity`}
                onClick={() => handlers.handleIncrease(actionItem)}
                disabled={isPending}
                className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary-100 transition-colors hover:bg-primary-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:h-10 md:w-10'
              >
                <img
                  src={plusIcon}
                  alt=''
                  aria-hidden='true'
                  className='h-5 w-5 md:h-6 md:w-6'
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
