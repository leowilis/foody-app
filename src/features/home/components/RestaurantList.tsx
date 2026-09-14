import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { COMING_SOON_LISTS } from '../types';
import type { ActiveList, RecommendedItem } from '../types';
import RestaurantCard from './RestaurantCard';

interface RestaurantListProps {
  activeList: ActiveList;
  titleText: string;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  shouldLogin: boolean;
  items: RecommendedItem[];
}

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
      <div className='col-span-full select-none animate-fadeIn'>
        <Alert className='rounded-3xl border border-neutral-100 p-6 bg-zinc-50/50'>
          <AlertTitle className='text-base font-bold tracking-tight text-neutral-900'>
            Coming Soon
          </AlertTitle>
          <AlertDescription className='text-sm text-neutral-500 mt-1 font-medium'>
            We&apos;re currently developing the {titleText} feature. Stay tuned!
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <>
        {/* Dynamic Status Loading Tracker */}
        <div className='flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 shadow-sm col-span-full select-none animate-pulse'>
          <div className='flex items-center gap-3'>
            <div className='h-2 w-2 rounded-full bg-primary-100' />
            <span className='text-sm font-bold tracking-tight text-neutral-800'>
              Loading data
            </span>
          </div>
          <span className='hidden text-xs font-semibold text-neutral-400 sm:block'>
            Please wait a moment.
          </span>
        </div>

        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`restaurant-skeleton-${index}`}
            className='flex flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm'
          >
            <Skeleton className='h-48 w-full rounded-none sm:h-52' />
            <div className='flex flex-col gap-3.5 p-5'>
              <Skeleton className='h-5 w-3/4 rounded-md' />
              <Skeleton className='h-4 w-1/3 rounded-md' />
              <Skeleton className='h-4 w-2/3 rounded-md' />
            </div>
          </div>
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
          <AlertDescription className='text-sm font-medium mt-1 opacity-90'>
            {errorMessage}
          </AlertDescription>

          {shouldLogin && (
            <div className='pt-4'>
              <Button
                type='button'
                onClick={() => navigate('/auth', { state: { tab: 'signin' } })}
                className='h-11 w-full sm:w-60 cursor-pointer rounded-full bg-white font-bold text-red-600 shadow-sm border border-red-200 transition-colors hover:bg-red-50 text-sm outline-none focus-visible:ring-2 focus-visible:ring-red-400'
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
        <Alert className='rounded-3xl border border-neutral-100 p-6 bg-zinc-50/50'>
          <AlertTitle className='text-base font-bold tracking-tight text-neutral-900'>
            No restaurants found
          </AlertTitle>
          <AlertDescription className='text-sm text-neutral-500 mt-1 font-medium'>
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
