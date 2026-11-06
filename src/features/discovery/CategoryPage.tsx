import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterPanel from './components/FilterPanel';
import RestaurantResults from './components/RestaurantResults';
import { useDiscoveryFilters } from './hooks/useDiscoveryFilters';
import { useRestaurantDiscovery } from './hooks/useRestaurantDiscovery';

// Renders the restaurant discovery page.
export default function CategoryPage() {
  const navigate = useNavigate();

  const { filters, page, updateFilters, setPage, clearFilters } =
    useDiscoveryFilters();

  const {
    data,
    isLoading,
    isError,
    isLoadingError,
    isFetching,
    isPlaceholderData,
    fetchStatus,
    error,
    refetch,
  } = useRestaurantDiscovery({
    page,
    filters,
  });

  const pagination = data?.data.pagination;
  const isPaused = fetchStatus === 'paused';

  useEffect(() => {
    if (!pagination || isFetching || isPaused || isPlaceholderData || isError) {
      return;
    }

    if (page > pagination.totalPages && pagination.totalPages >= 1) {
      setPage(pagination.totalPages);
    }
  }, [
    page,
    pagination,
    isFetching,
    isPaused,
    isPlaceholderData,
    isError,
    setPage,
  ]);

  return (
    <div className='mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
      <header className='mb-8'>
        <p className='text-xs font-bold uppercase tracking-[0.18em] text-primary-100'>
          Discover
        </p>

        <h1 className='mt-2 text-3xl font-black tracking-tight text-text sm:text-4xl'>
          Find your next favorite restaurant
        </h1>

        <p className='mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base'>
          Browse restaurants and refine your results by distance, price, and
          rating.
        </p>
      </header>

      <FilterPanel
        key={JSON.stringify(filters)}
        filters={filters}
        onApply={updateFilters}
        onClear={clearFilters}
      />

      <RestaurantResults
        data={data}
        page={page}
        isLoading={isLoading}
        isError={isError}
        isLoadingError={isLoadingError}
        isFetching={isFetching}
        isPaused={isPaused}
        isPlaceholderData={isPlaceholderData}
        error={error}
        onRetry={() => void refetch()}
        onPageChange={setPage}
        onRestaurantClick={(restaurantId) =>
          navigate(`/details/${restaurantId}`)
        }
      />
    </div>
  );
}
