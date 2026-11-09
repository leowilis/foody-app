import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '@/app/store';
import { clearKeyword } from '@/features/search/searchSlice';
import { getAuthToken } from '@/features/auth/authStorage';
import CategoryGrid from './components/CategoryGrid';
import HeroSection from './components/HeroSection';
import LoadMoreButton from './components/LoadMoreButton';
import RestaurantList from './components/RestaurantList';
import SearchSection from './components/SearchSection';
import { useActiveListData } from './hooks/useActiveListData';
import type { ActiveList } from './types';

const getTitle = (
  activeList: ActiveList,
  keyword: string,
  nearbyRangeKm: number,
): string => {
  switch (activeList) {
    case 'recommended':
      return 'Recommended';
    case 'best-seller':
      return 'Best Seller';
    case 'all-restaurants':
      return 'All Restaurants';
    case 'nearby':
      return `Nearby ( ${nearbyRangeKm} km Range )`;
    case 'search':
      return `Search Result of "${keyword.trim()}"`;
    default:
      return 'Restaurants';
  }
};

// Renders the home discovery page and manages restaurant list selection.
export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const keyword = useSelector((state: RootState) => state.search.keyword);

  const [activeList, setActiveList] = useState<ActiveList>(
    getAuthToken() ? 'recommended' : 'all-restaurants',
  );

  const handleCategorySelect = (list: ActiveList) => {
    dispatch(clearKeyword());
    setActiveList(list);
  };

  const trimmedKeyword = keyword.trim();

  const resolvedActiveList: ActiveList =
    trimmedKeyword.length > 0 ? 'search' : activeList;

  const {
    items,
    isLoading,
    isError,
    errorMessage,
    shouldLogin,
    isLocationUnavailable,
    recommendedQuery,
    bestSellerQuery,
    allRestaurantsQuery,
    nearbyRangeKm,
  } = useActiveListData(resolvedActiveList, keyword);

  const slides = recommendedQuery.data?.data?.recommendations ?? [];

  const paginatedQuery =
    resolvedActiveList === 'best-seller'
      ? bestSellerQuery
      : resolvedActiveList === 'all-restaurants'
        ? allRestaurantsQuery
        : null;

  const titleText = getTitle(resolvedActiveList, keyword, nearbyRangeKm);

  return (
    <div className='w-full overflow-x-hidden bg-background antialiased'>
      <HeroSection slides={slides} />

      <section
        id='restaurant-discovery'
        className='relative z-20 mx-auto flex w-full max-w-[1600px] flex-col px-6 py-4 md:px-12 lg:px-16'
      >
        <section className='pb-4 pt-6 md:pb-8 md:pt-10'>
          <SearchSection />
        </section>

        <section className='py-4 md:py-8'>
          <CategoryGrid onSelect={handleCategorySelect} />
        </section>

        <div className='flex flex-col gap-4 pb-12 pt-6 md:gap-8 md:pb-20 md:pt-0'>
          <div className='flex flex-row items-center justify-between'>
            <h2 className='text-xl font-bold tracking-tight text-text md:text-3xl'>
              {titleText}
            </h2>

            <button
              type='button'
              className='cursor-pointer text-sm font-extrabold text-primary-100 outline-none transition-colors hover:text-primary-200 focus-visible:underline md:text-base'
              onClick={() => navigate('/category')}
            >
              See All
            </button>
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6'>
            <RestaurantList
              isLoading={isLoading}
              isError={isError}
              errorMessage={errorMessage}
              shouldLogin={shouldLogin}
              isLocationUnavailable={isLocationUnavailable}
              items={items}
            />
          </div>

          <LoadMoreButton
            activeList={resolvedActiveList}
            hasNextPage={paginatedQuery?.hasNextPage ?? false}
            isFetchingNextPage={paginatedQuery?.isFetchingNextPage ?? false}
            isFetchNextPageError={paginatedQuery?.isFetchNextPageError ?? false}
            onLoadMore={() => {
              if (paginatedQuery && !paginatedQuery.isFetching) {
                void paginatedQuery.fetchNextPage();
              }
            }}
          />
        </div>
      </section>
    </div>
  );
}
