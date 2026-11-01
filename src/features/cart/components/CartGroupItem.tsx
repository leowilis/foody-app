import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/lib/format';
import type { CartHandlers } from '../hooks/useCartHandlers';
import type { CartRestaurant } from '../types';
import CartItemRow from './CartItemRow';
import restaurantPlaceholder from '@/assets/icon-restaurant-dummy.svg';
import chevronRightIcon from '@/assets/chevron-right.svg';

interface CartGroupItemProps {
  group: CartRestaurant;
  handlers: CartHandlers;
}

// Displays a restaurant's cart items, subtotal, and checkout action.
export default function CartGroupItem({ group, handlers }: CartGroupItemProps) {
  const navigate = useNavigate();
  const { handleIncrease, handleDecrease, isItemPending } = handlers;
  const restaurantDetailsPath = `/details/${group.restaurant.id}`;
  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className='flex h-fit flex-col gap-3 rounded-3xl border border-border bg-surface px-4 py-4 shadow-foody-md md:gap-5'>
      {/* Restaurant navigation */}
      <Link
        to={restaurantDetailsPath}
        className='flex w-fit flex-row items-center gap-1 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring md:gap-2'
      >
        <img
          src={group.restaurant.logo || restaurantPlaceholder}
          alt=''
          loading='lazy'
          className='h-8 w-8 rounded-full object-cover'
        />

        <span className='text-base font-bold leading-7.5 -tracking-[0.02em] text-text md:text-lg md:leading-8 md:-tracking-[0.03em]'>
          {group.restaurant.name}
        </span>

        <img
          src={chevronRightIcon}
          alt=''
          aria-hidden='true'
          className='h-5 w-5 invert'
        />
      </Link>

      {/* Cart items */}
      <div className='flex flex-col gap-3'>
        {group.items.map((item) => {
          const itemIsPending = isItemPending(item.menu.id);

          return (
            <CartItemRow
              key={item.id}
              item={item}
              onIncrease={() =>
                handleIncrease({
                  menuId: item.menu.id,
                  restaurantId: group.restaurant.id,
                  restaurantName: group.restaurant.name,
                  name: item.menu.foodName,
                  price: item.menu.price,
                  image: item.menu.image,
                  type: item.menu.type,
                  qty: item.quantity,
                  cartItemId: item.id,
                })
              }
              onDecrease={() => handleDecrease(item.menu.id)}
              isUpdating={itemIsPending}
              isDeleting={itemIsPending}
            />
          );
        })}
      </div>

      {/* Cart subtotal */}
      <hr className='border-t border-dashed border-border-strong' />

      <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <div className='flex flex-col'>
          <span className='-mb-1 text-sm font-medium leading-7 -tracking-[0.03em] text-text-secondary md:text-base md:leading-7.5'>
            Total
          </span>

          <span className='text-lg font-extrabold leading-8 -tracking-[0.02em] text-text md:text-xl md:leading-8.5'>
            {formatRupiah(group.subtotal)}
          </span>
        </div>

        {/* Checkout action */}
        <Button
          type='button'
          onClick={handleCheckout}
          className='h-11 w-full rounded-pill bg-primary-100 text-[14px] font-bold leading-7 text-white -tracking-[0.02em] hover:bg-primary-200 md:h-12 md:w-60 md:text-[16px] md:leading-7.5'
        >
          Checkout
        </Button>
      </div>
    </div>
  );
}
