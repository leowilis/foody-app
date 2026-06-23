import { useNavigate } from 'react-router-dom';
import {
  COMING_SOON_LISTS,
  type ActiveList,
  type RecommendedItem,
} from '../types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
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

// Renders the list section: loading skeletons, errors, or restaurant cards
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
      <div className='md:col-span-3'>
        <Alert>
          <AlertTitle>Coming Soon</AlertTitle>
          <AlertDescription>
            We're currently developing the {titleText} feature to enhance your
            experience. Stay tuned!
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <>
        <div className='flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.06)] md:col-span-3'>
          <div className='flex items-center gap-3'>
            <div className='h-2.5 w-2.5 animate-pulse rounded-full bg-primary-100' />
            <span className='text-sm font-semibold text-neutral-700'>
              Loading data
            </span>
          </div>
          <span className='text-xs text-neutral-500'>
            Please wait a moment.
          </span>
        </div>
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className='flex flex-row gap-2 rounded-3xl px-3 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.06)] md:gap-3 md:px-4 md:py-4'
          >
            <Skeleton className='h-22.5 w-22.5 md:h-30 md:w-30' />
            <div className='flex w-full flex-col gap-2'>
              <Skeleton className='h-5 w-3/4' />
              <Skeleton className='h-4 w-1/3' />
              <Skeleton className='h-4 w-2/3' />
            </div>
          </div>
        ))}
      </>
    );
  }

  if (isError) {
    return (
      <div className='md:col-span-3'>
        <Alert variant='destructive'>
          <AlertTitle>Failed to load data.</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
          {shouldLogin && (
            <div className='pt-3'>
              <Button
                onClick={() => navigate('/auth', { state: { tab: 'signin' } })}
                className='h-10 w-40 cursor-pointer rounded-[100px] bg-primary-100 p-2 text-[14px] font-bold leading-7 text-white -tracking-[0.02em] md:h-11 md:w-60 md:text-[16px] md:leading-7.5'
              >
                Login to view data
              </Button>
            </div>
          )}
        </Alert>
      </div>
    );
  }
  return (
    <>
      <div className='flex flex-col divide-y divide-neutral-100'>
        {items.map((item) => (
          <RestaurantCard
            key={item.id}
            item={item}
            onClick={() => navigate(`/details/${item.id}`)}
          />
        ))}
      </div>
    </>
  );
}
