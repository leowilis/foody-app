import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/lib/format';
import CartItemRow from './CartItemRow';
import type { CartMutations, CartRestaurant } from './types';

interface CartGroupProps {
  group: CartRestaurant;
  mutations: CartMutations;
}

// Single restaurant group — header, items, subtotal, and checkout button.
export default function CartGroup({ group, mutations }: CartGroupProps) {
  const navigate = useNavigate();
  const { updateMutation, deleteMutation, handleIncrease, handleDecrease } =
    mutations;

  return (
    <div className='flex h-fit flex-col gap-3 rounded-3xl px-4 py-4 shadow-sm md:gap-5'>
      <div
        className='flex cursor-pointer flex-row items-center gap-1 md:gap-2'
        onClick={() => navigate(`/details/${group.restaurant.id}`)}
      >
        <img
          src={
            group.restaurant.logo || '/images/common/icon-restaurant-dummy.svg'
          }
          className='h-8 w-8'
          alt={group.restaurant.name}
        />
        <span className='text-base font-bold leading-7.5 -tracking-[0.02em] md:text-lg md:leading-8 md:-tracking-[0.03em]'>
          {group.restaurant.name}
        </span>
        <img
          src='/images/common/chevron-right.svg'
          className='h-5 w-5'
          alt=''
        />
      </div>

      {group.items.map((item) => (
        <CartItemRow
          key={item.id}
          item={item}
          onIncrease={() => handleIncrease(item, group)}
          onDecrease={() => handleDecrease(item, group)}
          isUpdating={updateMutation.isPending}
          isDeleting={deleteMutation.isPending}
        />
      ))}

      <hr className='border-t border-dashed border-neutral-300' />

      <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <div className='flex flex-col'>
          <span className='-mb-1 text-sm font-medium leading-7 -tracking-[0.03em] md:text-base md:leading-7.5'>
            Total
          </span>
          <span className='text-lg font-extrabold leading-8 -tracking-[0.02em] md:text-xl md:leading-8.5'>
            {formatRupiah(group.subtotal)}
          </span>
        </div>
        <Button
          onClick={() =>
            navigate('/checkout', {
              state: {
                cart: [group],
                summary: {
                  totalItems: group.items.reduce(
                    (sum, item) => sum + item.quantity,
                    0,
                  ),
                  totalPrice: group.subtotal,
                  restaurantCount: 1,
                },
              },
            })
          }
          className='h-11 w-full cursor-pointer rounded-[100px] bg-primary-100 text-[14px] font-bold leading-7 text-white -tracking-[0.02em] md:h-12 md:w-60 md:text-[16px] md:leading-7.5'
        >
          Checkout
        </Button>
      </div>
    </div>
  );
}
