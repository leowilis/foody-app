import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Displays the empty state shown when the shopping cart has no items.
export default function CartEmpty() {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center justify-center gap-4 rounded-3xl p-8 shadow-sm'>
      <img
        src='/images/common/empty-cart.svg'
        alt='Empty cart'
        className='h-32 w-32 opacity-50'
      />
      <h2 className='text-xl font-bold'>Your cart is empty</h2>
      <p className='text-center text-neutral-500'>
        Start adding delicious items to your cart!
      </p>

      {/* Button Browse */}
      <Button
        type='button'
        onClick={() => navigate('/')}
        className='h-11 rounded-full bg-primary-100 px-8 font-bold text-white'
      >
        Browse Restaurants
      </Button>
    </div>
  );
}
