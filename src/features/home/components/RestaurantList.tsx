import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  COMING_SOON_LISTS,
  type ActiveList,
  type RecommendedItem,
} from '../types';
import RestaurantCard from './RestaurantCard';
import RestaurantCardSkeleton from './RestaurantCardSkeleton';

interface RestaurantListProps {
  activeList: ActiveList;
  titleText: string;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  shouldLogin: boolean;
  items: RecommendedItem[];
}

// Displays restaurant results and their current state.
export default function RestaurantList({
  activeList,
  titleText,
  isLoading,
  isError,
  errorMessage,
  shouldLogin,
  items,
}: RestaurantListProps) {
  const navigate = useNavigate();
  const isComingSoon = COMING_SOON_LISTS.includes(activeList);

  if (isComingSoon) {
    return (
      <div className='col-span-full select-none'>
        <Alert className='rounded-3xl border border-neutral-100 bg-zinc-50/50 p-6'>
          <AlertTitle className='text-base font-bold tracking-tight text-neutral-900'>
            Coming Soon
          </AlertTitle>

          <AlertDescription className='mt-1 text-sm font-medium text-neutral-500'>
            We&apos;re currently developing the {titleText} feature. Stay tuned!
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <>
        <div className='col-span-full flex select-none items-center justify-between rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 shadow-sm'>
          <div className='flex items-center gap-3'>
            <div
              aria-hidden='true'
              className='h-2 w-2 animate-pulse rounded-full bg-primary-100'
            />

            <span className='text-sm font-bold tracking-tight text-neutral-800'>
              Loading data
            </span>
          </div>

          <span className='hidden text-xs font-semibold text-neutral-400 sm:block'>
            Please wait a moment.
          </span>
        </div>

        {Array.from({ length: 4 }).map((_, index) => (
          <RestaurantCardSkeleton key={`restaurant-skeleton-${index}`} />
        ))}
      </>
    );
  }

  if (isError) {
    return (
      <div className='col-span-full select-none'>
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
                onClick={() =>
                  navigate('/auth', {
                    state: { tab: 'signin' },
                  })
                }
                className='h-11 w-full cursor-pointer rounded-full border border-red-200 bg-white text-sm font-bold text-red-600 shadow-sm outline-none transition-colors hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-400 sm:w-60'
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
      <div className='col-span-full select-none'>
        <Alert className='rounded-3xl border border-neutral-100 bg-zinc-50/50 p-6'>
          <AlertTitle className='text-base font-bold tracking-tight text-neutral-900'>
            No restaurants found
          </AlertTitle>

          <AlertDescription className='mt-1 text-sm font-medium text-neutral-500'>
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
          key={`restaurant-item-${item.id}`}
          item={item}
          onClick={() => navigate(`/details/${item.id}`)}
        />
      ))}
    </>
  );
}
