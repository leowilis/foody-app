import type { RootState } from '@/app/store';
import { formatRupiah } from '@/lib/format';
import { useSelector } from 'react-redux';

export default function CheckoutBar() {
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
      </div>
    </div>
  );
}
