import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/lib/format';
import type { useCartMutations } from '../hooks/useCartMutations';
import type { MenuItem } from '../type';

interface MenuCardProps {
  menu: MenuItem;
  qty: number;
  restaurantId: number;
  mutations: ReturnType<typeof useCartMutations>;
}

// Single menu item card with add/increase/decrease quantity controls.
export default function MenuCard({
  menu,
  qty,
  restaurantId,
  mutations,
}: MenuCardProps) {
  const {
    addMutation,
    updateMutation,
    deleteMutation,
    handleIncrease,
    handleDecrease,
  } = mutations;

  return (
    <div className='flex flex-col rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-transform duration-200 hover:scale-[1.05]'>
      <div
        className='h-[172.5px] rounded-tl-2xl rounded-tr-2xl bg-cover bg-center bg-no-repeat'
        style={{
          backgroundImage: `url('${menu.image || '/images/common/details-dummy-1.svg'}')`,
        }}
      />
      <div className='flex flex-col gap-4 px-3 py-3 md:flex-row md:justify-between md:px-4 md:py-4'>
        <div className='flex flex-col md:flex-1'>
          <span className='text-[14px] font-medium leading-7 md:text-[16px] md:leading-7 md:-tracking-[0.03em]'>
            {menu.foodName}
          </span>
          <h3 className='text-[16px] font-extrabold leading-7.5 md:text-[18px] md:leading-8 md:-tracking-[0.02em]'>
            {formatRupiah(menu.price)}
          </h3>
        </div>

        <div className='flex items-center justify-center md:flex-1'>
          {qty === 0 ? (
            <Button
              onClick={() =>
                addMutation.mutate({
                  restaurantId,
                  menuId: menu.id,
                  quantity: 1,
                })
              }
              disabled={addMutation.isPending}
              className='h-9 w-full cursor-pointer rounded-[100px] bg-primary-100 text-[14px] font-bold leading-7 text-white -tracking-[0.02em] hover:bg-primary-200 disabled:cursor-not-allowed disabled:opacity-50 md:h-10 md:text-[16px] md:leading-7.5'
            >
              {addMutation.isPending ? 'Adding...' : 'Add'}
            </Button>
          ) : (
            <div className='flex flex-row items-center gap-4'>
              <button
                onClick={() => handleDecrease(menu.id)}
                disabled={updateMutation.isPending || deleteMutation.isPending}
                className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-full ring-1 ring-inset ring-neutral-300 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50 md:h-10 md:w-10'
              >
                <img
                  src='/images/common/minus.svg'
                  alt='decrease'
                  className='h-5 w-5 md:h-6 md:w-6'
                />
              </button>
              <span className='min-w-5 text-center text-[16px] font-semibold leading-7.5 -tracking-[0.02em] md:text-[18px] md:leading-8'>
                {qty}
              </span>
              <button
                onClick={() => handleIncrease(menu.id, restaurantId)}
                disabled={addMutation.isPending || updateMutation.isPending}
                className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary-100 hover:bg-primary-200 disabled:cursor-not-allowed disabled:opacity-50 md:h-10 md:w-10'
              >
                <img
                  src='/images/common/plus.svg'
                  alt='increase'
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
