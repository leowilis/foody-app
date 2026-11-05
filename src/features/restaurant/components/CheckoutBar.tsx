import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '@/app/store';
import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/lib/format';

// Displays the current cart summary and checkout action.
export default function CheckoutBar() {
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );

  return (
    <div className='fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface px-4 py-4 shadow-foody-lg'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-4'>
        <div className='min-w-0'>
          <p className='text-sm font-medium text-text-secondary'>
            {totalItems} items
          </p>

          <p className='text-base font-extrabold text-text md:text-lg'>
            {formatRupiah(totalPrice)}
          </p>
        </div>

        <Button
          type='button'
          onClick={() => navigate('/checkout')}
          className='h-11 shrink-0 rounded-pill bg-primary-100 px-6 text-[14px] font-bold leading-7 text-primary-foreground -tracking-[0.02em] hover:bg-primary-200 md:h-12 md:px-8 md:text-[16px] md:leading-7.5'
        >
          Checkout
        </Button>
      </div>
    </div>
  );
}
