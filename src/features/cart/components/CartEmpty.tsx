import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

/**
 * Displays the empty-cart state and provides navigation
 * back to restaurant discovery.
 */
export default function CartEmpty() {
  const navigate = useNavigate();
  const handleBrowseRestaurants = () => {
    navigate('/');
  };

  return (
    <div className='flex flex-col items-center justify-center gap-4 rounded-3xl p-8 shadow-sm'>
      {/* Empty cart illustration */}
      <img
        src='/images/common/empty-cart.svg'
        alt=''
        aria-hidden='true'
        className='h-32 w-32 opacity-50'
      />

      {/* Empty cart message */}
      <div className='text-center'>
        <h2 className='text-xl font-bold'>Your cart is empty</h2>
        <p className='mt-1 text-neutral-500'>
          Start adding delicious items to your cart!
        </p>
      </div>

      {/* Restaurant discovery action */}
      <Button
        type='button'
        onClick={handleBrowseRestaurants}
        className='h-11 rounded-full bg-primary-100 px-8 font-bold text-white'
      >
        Browse Restaurants
      </Button>
    </div>
  );
}
