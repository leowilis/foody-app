import RestaurantCard from '@/features/home/components/RestaurantCard';
import { getErrorMessage } from '@/lib/api-helpers';
import type { RestaurantDiscoveryResponse } from '../types';

interface RestaurantResultsProps {
  readonly data: RestaurantDiscoveryResponse | undefined;
  readonly page: number;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly isLoadingError: boolean;
  readonly isFetching: boolean;
  readonly isPaused: boolean;
  readonly isPlaceholderData: boolean;
  readonly error: Error | null;
  readonly onRetry: () => void;
  readonly onPageChange: (page: number) => void;
  readonly onRestaurantClick: (restaurantId: number) => void;
}

// Renders discovery results and their loading, error, and empty states.
export default function RestaurantResults({
  data,
  page,
  isLoading,
  isError,
  isLoadingError,
  isFetching,
  isPaused,
  isPlaceholderData,
  error,
  onRetry,
  onPageChange,
  onRestaurantClick,
}: RestaurantResultsProps) {
  const restaurants = data?.data.restaurants ?? [];
  const pagination = data?.data.pagination;
  const canShowResults =
    !isPaused && !isLoadingError && (!isError || Boolean(data));

  return (
    <section aria-labelledby='restaurant-results-heading' className='mt-10'>
      <div className='mb-5 flex items-center justify-between gap-4'>
        <div>
          <h2
            id='restaurant-results-heading'
            className='text-xl font-bold text-text'
          >
            Restaurants
          </h2>

          {pagination && canShowResults && !isPlaceholderData && (
            <p className='mt-1 text-sm text-text-secondary'>
              {pagination.total} restaurants found
            </p>
          )}
        </div>

        {isFetching && !isLoading && !isPaused && (
          <span role='status' className='text-sm text-text-secondary'>
            Updating…
          </span>
        )}
      </div>

      {isPaused && (
        <div
          role='status'
          className='rounded-3xl border border-border bg-surface p-8 text-center'
        >
          <h3 className='text-lg font-bold text-text'>You&apos;re offline</h3>
          <p className='mt-2 text-sm text-text-secondary'>
            We can&apos;t load restaurants for the selected filters right now.
            Reconnect to the internet to load the latest results.
          </p>
        </div>
      )}

      {isLoading && !isPaused && (
        <div role='status' className='py-16 text-center'>
          <p className='text-sm font-semibold text-text'>
            Finding restaurants…
          </p>
        </div>
      )}

      {isPlaceholderData && !isPaused && (
        <p
          role='status'
          className='mb-5 rounded-xl border border-border bg-surface p-4 text-sm text-text-secondary'
        >
          Updating results. Previously loaded restaurants are shown until the
          new results arrive.
        </p>
      )}

      {isLoadingError && !isPaused && (
        <div
          role='alert'
          className='rounded-3xl border border-error/30 bg-surface p-8 text-center'
        >
          <h3 className='text-lg font-bold text-text'>
            We couldn&apos;t load the restaurants
          </h3>
          <p className='mt-2 text-sm text-text-secondary'>
            {getErrorMessage(error)}
          </p>
          <button
            type='button'
            onClick={onRetry}
            disabled={isFetching}
            className='mt-5 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {isFetching ? 'Retrying…' : 'Try again'}
          </button>
        </div>
      )}

      {isError && data && !isPaused && (
        <div
          role='alert'
          className='mb-5 rounded-xl border border-error/30 bg-surface p-4'
        >
          <p className='text-sm text-text-secondary'>
            We couldn&apos;t update the restaurant results. The previously
            loaded data is still available.
          </p>
          <button
            type='button'
            onClick={onRetry}
            disabled={isFetching}
            className='mt-2 text-sm font-bold text-primary-100 disabled:opacity-50'
          >
            {isFetching ? 'Retrying…' : 'Try again'}
          </button>
        </div>
      )}

      {canShowResults && !isLoading && restaurants.length === 0 && (
        <div className='rounded-3xl border border-border bg-surface p-8 text-center'>
          <h3 className='text-lg font-bold text-text'>No restaurants found</h3>
          <p className='mt-2 text-sm text-text-secondary'>
            No restaurants match your current filters. Try adjusting your rating
            or clearing some filters.
          </p>
        </div>
      )}

      {canShowResults && !isLoading && restaurants.length > 0 && (
        <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              item={restaurant}
              onClick={() => onRestaurantClick(restaurant.id)}
            />
          ))}
        </div>
      )}

      {canShowResults &&
        !isLoading &&
        !isPlaceholderData &&
        pagination &&
        pagination.totalPages > 1 && (
          <nav
            aria-label='Restaurant pagination'
            className='mt-8 flex items-center justify-center gap-3'
          >
            <button
              type='button'
              disabled={page <= 1 || isFetching}
              onClick={() => onPageChange(page - 1)}
              className='rounded-xl border border-border px-4 py-2 text-sm font-semibold text-text transition-colors hover:border-border-strong disabled:cursor-not-allowed disabled:opacity-40'
            >
              Previous
            </button>

            <span
              aria-current='page'
              className='text-sm font-semibold text-text-secondary'
            >
              Page {page} of {pagination.totalPages}
            </span>

            <button
              type='button'
              disabled={page >= pagination.totalPages || isFetching}
              onClick={() => onPageChange(page + 1)}
              className='rounded-xl border border-border px-4 py-2 text-sm font-semibold text-text transition-colors hover:border-border-strong disabled:cursor-not-allowed disabled:opacity-40'
            >
              Next
            </button>
          </nav>
        )}
    </section>
  );
}
