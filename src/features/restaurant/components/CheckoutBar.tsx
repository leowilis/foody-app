import type { RootState } from '@/app/store';
import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/lib/format';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CheckoutBar() {
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );

  return (
    <div className='fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white p-4'>
      <div className='mx-auto flex max-w-7xl items-center justify-between'>
        <div>
          <p className='text-sm text-neutral-500'>{totalItems} items</p>
          <p>{formatRupiah(totalPrice)}</p>
        </div>
        <Button
          onClick={() => navigate('/checkout')}
          className='h-12 rounded-[100px] bg-primary-100 px-8 text-[16px] font-bold leading-7 text-white -tracking-[0.02em] hover:bg-primary-200'
        >
          Checkout
        </Button>
      </div>
    </div>
  );
}
