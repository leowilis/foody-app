import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import CartSkeleton from '@/features/cart/components/CartSkeleton';
import { useMyCart } from './hooks/useMyCart';
import CartEmpty from './components/CartEmpty';
import CartGroupItem from './components/CartGroupItem';
import type { CartMutations } from './types';

// My Cart page — grouped cart items with checkout per restaurant.
export default function MyCartPage() {
  const navigate = useNavigate();
  const {
    cartGroups,
    isLoading,
    isError,
    errorMessage,
    shouldLogin,
    updateMutation,
    deleteMutation,
    handleIncrease,
    handleDecrease,
  } = useMyCart();

  const mutations: CartMutations = {
    updateMutation,
    deleteMutation,
    handleIncrease,
    handleDecrease,
  };

  const isEmpty = !isLoading && !isError && cartGroups.length === 0;

  return (
    <main className='mt-16 flex w-full flex-col items-center gap-4 px-4 pt-4 text-neutral-950 md:mt-32 md:gap-8 md:px-30 md:pt-0 mb-12 md:mb-25'>
      <div className='flex w-full flex-col gap-4 md:w-200 md:gap-8'>
        <h1 className='text-2xl font-extrabold leading-9 md:text-[32px] md:leading-10.5'>
          My Cart
        </h1>

        <div className='flex flex-col gap-5'>
          {isLoading && <CartSkeleton />}

          {isError && !shouldLogin && (
            <Alert variant='destructive'>
              <AlertTitle>Failed to load cart</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {shouldLogin && (
            <Alert>
              <AlertTitle>Login Required</AlertTitle>
              <AlertDescription>
                Please login to sync your cart across devices.
              </AlertDescription>
              <div className='pt-3'>
                <Button
                  onClick={() =>
                    navigate('/auth', { state: { tab: 'signin' } })
                  }
                  className='h-9 rounded-[100px] bg-primary-100 text-[14px] font-bold leading-7 text-white -tracking-[0.02em]'
                >
                  Login to sync cart
                </Button>
              </div>
            </Alert>
          )}

          {isEmpty && <CartEmpty />}

          {!isLoading &&
            cartGroups.map((group) => (
              <CartGroupItem
                key={group.restaurant.id}
                group={group}
                mutations={mutations}
              />
            ))}
        </div>
      </div>
    </main>
  );
}
