import { BsCartXFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Shows the empty state when the checkout cart has no items.
export default function CheckoutEmpty() {
  const navigate = useNavigate();

  const handleBrowseRestaurants = () => {
    navigate('/');
  };

  return (
    <div className='flex flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-surface px-6 py-10 text-center shadow-foody-sm md:px-8 md:py-12'>
      {/* Empty cart visual */}
      <BsCartXFill
        aria-hidden='true'
        className='mb-4 h-20 w-20 text-text-muted md:h-24 md:w-24'
      />

      {/* Empty cart message */}
      <div className='flex flex-col gap-1'>
        <h2 className='text-xl font-bold leading-8 text-text'>
          Your cart is empty
        </h2>

        <p className='max-w-md text-sm font-medium leading-6 text-text-secondary md:text-base md:leading-7'>
          Add some delicious food to your cart before checking out!
        </p>
      </div>

      {/* Return to the restaurant discovery page. */}
      <Button
        type='button'
        onClick={handleBrowseRestaurants}
        className='h-11 rounded-pill bg-primary-100 px-8 font-bold text-primary-foreground transition-colors hover:bg-primary-200 focus-visible:ring-2 focus-visible:ring-ring md:h-12'
      >
        Browse Restaurants
      </Button>
    </div>
  );
}
