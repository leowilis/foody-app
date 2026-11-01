import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import CartEmpty from './components/CartEmpty';
import CartGroupItem from './components/CartGroupItem';
import CartSkeleton from './components/CartSkeleton';
import { useMyCart } from './hooks/useMyCart';

// Renders the authenticated user's cart and cart actions.
export default function MyCartPage() {
  const {
    cartGroups,
    isLoading,
    isError,
    error,
    handleIncrease,
    handleDecrease,
    isItemPending,
  } = useMyCart();

  const isEmpty = !isLoading && !isError && cartGroups.length === 0;

  return (
    <main className='mb-12 mt-10 flex w-full flex-col items-center gap-4 px-4 pt-4 text-text md:mb-25 md:mt-32 md:gap-8 md:px-30 md:pt-0'>
      <div className='flex w-full flex-col gap-4 md:w-200 md:gap-8'>
        <h1 className='text-2xl font-extrabold leading-9 md:text-[32px] md:leading-10.5'>
          My Cart
        </h1>

        <div className='flex flex-col gap-5'>
          {/* Show the loading state while the server cart is being fetched. */}
          {isLoading && <CartSkeleton />}

          {/* Show the server error without hiding the rest of the page. */}
          {isError && (
            <Alert variant='destructive'>
              <AlertTitle>Failed to load cart</AlertTitle>
              <AlertDescription>
                {error instanceof Error
                  ? error.message
                  : 'Failed to load cart. Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Show the empty state after the authenticated cart is loaded. */}
          {isEmpty && <CartEmpty />}

          {/* Render each restaurant group with its cart actions. */}
          {!isLoading &&
            !isError &&
            cartGroups.map((group) => (
              <CartGroupItem
                key={group.restaurant.id}
                group={group}
                handlers={{
                  handleIncrease,
                  handleDecrease,
                  isItemPending,
                }}
              />
            ))}
        </div>
      </div>
    </main>
  );
}
