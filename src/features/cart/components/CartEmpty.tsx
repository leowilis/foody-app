import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

// Displays the empty-cart state and provides navigation back to restaurant discovery.
export default function CartEmpty() {
  const navigate = useNavigate();

  const handleBrowseRestaurants = () => {
    navigate('/');
  };

  return (
    <div className='flex flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-surface px-6 py-10 shadow-foody-sm md:px-8 md:py-12'>
      {/* Empty cart illustration */}
      <ShoppingCart size={48} strokeWidth={1.5} aria-hidden='true' />

      {/* Empty cart message */}
      <div className='text-center'>
        <h2 className='text-xl font-bold text-text'>Your cart is empty</h2>

        <p className='mt-1 text-sm text-text-secondary md:text-base'>
          Start adding delicious items to your cart!
        </p>
      </div>

      {/* Restaurant discovery action */}
      <Button
        type='button'
        onClick={handleBrowseRestaurants}
        className='h-11 rounded-pill bg-primary-100 px-8 font-bold text-white hover:bg-primary-200'
      >
        Browse Restaurants
      </Button>
    </div>
  );
}
