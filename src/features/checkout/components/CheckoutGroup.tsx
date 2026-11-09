import { useNavigate } from 'react-router-dom';
import type { CartHandlers } from '@/features/cart/hooks/useCartHandlers';
import type { CheckoutCartGroup } from '../types';
import CheckoutItemRow from './CheckoutItemRow';
import restaurantPlaceholder from '@/assets/icon-restaurant-dummy.svg';

interface CheckoutGroupProps {
  group: CheckoutCartGroup;
  isCheckoutPending: boolean;
  isItemPending: CartHandlers['isItemPending'];
  onIncrease: CartHandlers['handleIncrease'];
  onDecrease: CartHandlers['handleDecrease'];
}

// Groups checkout items by restaurant and provides item actions.
export default function CheckoutGroup({
  group,
  isItemPending,
  isCheckoutPending,
  onIncrease,
  onDecrease,
}: CheckoutGroupProps) {
  const navigate = useNavigate();

  const handleAddItem = () => {
    navigate(`/details/${group.restaurant.id}`);
  };

  return (
    <div className='flex flex-col gap-3 rounded-3xl border border-border bg-surface p-4 shadow-foody-md md:gap-5 md:p-5'>
      {/* Show the restaurant and allow more items to be added. */}
      <div className='flex flex-row items-center justify-between gap-3'>
        <div className='flex min-w-0 flex-row items-center gap-2'>
          <img
            src={group.restaurant.logo || restaurantPlaceholder}
            alt={group.restaurant.name}
            onError={(event) => {
              const image = event.currentTarget;

              image.onerror = null;
              image.src = restaurantPlaceholder;
            }}
            className='h-8 w-8 shrink-0 rounded-xl object-cover'
          />

          <span className='truncate text-base font-bold leading-7.5 -tracking-[0.02em] text-text md:text-lg md:leading-8 md:-tracking-[0.03em]'>
            {group.restaurant.name}
          </span>
        </div>

        <button
          type='button'
          onClick={handleAddItem}
          disabled={isCheckoutPending}
          className='flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-pill border border-border bg-surface-subtle px-4 text-sm font-bold leading-7 -tracking-[0.02em] text-text transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:h-10 md:px-5 md:text-base md:leading-7.5'
        >
          Add Item
        </button>
      </div>

      {/* Render each item with its quantity controls. */}
      <div className='flex flex-col'>
        {group.items.map((item) => {
          const itemIsPending = isItemPending(item.menu.id);

          return (
            <CheckoutItemRow
              key={item.id}
              item={item}
              isPending={itemIsPending || isCheckoutPending}
              onIncrease={() =>
                onIncrease({
                  menuId: item.menu.id,
                  restaurantId: group.restaurant.id,
                  restaurantName: group.restaurant.name,
                  name: item.menu.foodName,
                  price: item.menu.price,
                  type: item.menu.type,
                  image: item.menu.image,
                  qty: item.quantity,
                  cartItemId: item.id,
                })
              }
              onDecrease={() => onDecrease(item.menu.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
