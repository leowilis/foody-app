import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type { RecommendedItem } from '../types';
import RestaurantCard from './RestaurantCard';
import RestaurantCardSkeleton from './RestaurantCardSkeleton';

interface RestaurantListProps {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  shouldLogin: boolean;
  isLocationUnavailable: boolean;
  items: readonly RecommendedItem[];
}

// Displays restaurant results and their current loading or error state.
export default function RestaurantList({
  isLoading,
  isError,
  errorMessage,
  shouldLogin,
  isLocationUnavailable,
  items,
}: RestaurantListProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <>
        <div
          role='status'
          aria-live='polite'
          aria-label='Loading restaurants'
          className='col-span-full flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3.5 shadow-foody-sm'
        >
          <div className='flex items-center gap-3'>
            <div
              aria-hidden='true'
              className='h-2 w-2 animate-pulse rounded-full bg-primary-100'
            />
            <span className='text-sm font-bold tracking-tight text-text'>
              Loading data
            </span>
          </div>

          <span className='hidden text-xs font-semibold text-text-muted sm:block'>
            Please wait a moment.
          </span>
        </div>

        {Array.from({ length: 4 }).map((_, index) => (
          <RestaurantCardSkeleton key={index} />
        ))}
      </>
    );
  }

  if (isLocationUnavailable) {
    return (
      <div className='col-span-full'>
        <Alert className='rounded-3xl border border-border bg-surface p-6'>
          <AlertTitle className='text-base font-bold tracking-tight text-text'>
            Location unavailable
          </AlertTitle>

          <AlertDescription className='mt-1 text-sm font-medium text-text-secondary'>
            Your location has not been configured yet. You can explore available
            restaurants instead.
          </AlertDescription>

          <div className='pt-4'>
            <Button
              type='button'
              onClick={() => navigate('/category')}
              className='h-11 w-full cursor-pointer rounded-pill text-sm font-bold shadow-foody-sm sm:w-60'
            >
              Explore Restaurants
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='col-span-full'>
        <Alert variant='destructive' className='rounded-3xl p-6'>
          <AlertTitle className='text-base font-bold tracking-tight'>
            Failed to load data.
          </AlertTitle>

          <AlertDescription className='mt-1 text-sm font-medium opacity-90'>
            {errorMessage}
          </AlertDescription>

          {shouldLogin && (
            <div className='pt-4'>
              <Button
                type='button'
                onClick={() => navigate('/auth', { state: { tab: 'signin' } })}
                className='h-11 w-full cursor-pointer rounded-pill border border-error bg-surface text-sm font-bold text-error shadow-foody-sm outline-none transition-colors hover:bg-error/10 focus-visible:ring-2 focus-visible:ring-error sm:w-60'
              >
                Login to view data
              </Button>
            </div>
          )}
        </Alert>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className='col-span-full'>
        <Alert className='rounded-3xl border border-border bg-surface p-6'>
          <AlertTitle className='text-base font-bold tracking-tight text-text'>
            No restaurants found
          </AlertTitle>

          <AlertDescription className='mt-1 text-sm font-medium text-text-secondary'>
            Try a different category or search keyword.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      {items.map((item) => (
        <RestaurantCard
          key={item.id}
          item={item}
          onClick={() => navigate(`/details/${item.id}`)}
        />
      ))}
    </>
  );
}
