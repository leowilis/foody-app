import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HeroSection from './components/HeroSection';
import CategoryGrid from './components/CategoryGrid';
import RestaurantList from './components/RestaurantList';
import LoadMoreButton from './components/LoadMoreButton';
import { useActiveListData } from './hooks/useActiveListData';
import type { RootState } from '@/app/store';
import type { ActiveList } from './types';

// Maps the active list key to a human-readable section title.
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
      return 'All Restaurant';
    case 'nearby':
      return `Nearby ( ${nearbyRangeKm} km Range )`;
    case 'discount':
      return 'Discount';
    case 'delivery':
      return 'Delivery';
    case 'lunch':
      return 'Lunch';
    default:
      return `Search Result of "${keyword.trim()}"`;
  }
};

// Reads auth token from either storage — localStorage takes priority.
const getToken = () =>
  localStorage.getItem('auth_token') ?? sessionStorage.getItem('auth_token');

// Main home screen — browse restaurants, search, and filter by category.
export default function HomePage() {
  const navigate = useNavigate();
  const keyword = useSelector((state: RootState) => state.search.keyword);
  const [activeList, setActiveList] = useState<ActiveList>(
    getToken() ? 'recommended' : 'all-restaurants',
  );

  const {
    items,
    isLoading,
    isError,
    errorMessage,
    shouldLogin,
    recommendedQuery,
    bestSellerQuery,
    allRestaurantsQuery,
    nearbyQuery,
    nearbyRangeKm,
  } = useActiveListData(activeList, keyword);

  const slides = recommendedQuery.data?.data?.recommendations ?? [];

  const paginatedQuery = (
    {
      'best-seller': bestSellerQuery,
      'all-restaurants': allRestaurantsQuery,
      nearby: nearbyQuery,
    } as const
  )[activeList as 'best-seller' | 'all-restaurants' | 'nearby'];

  const titleText = getTitle(activeList, keyword, nearbyRangeKm);

  return (
    <>
      <HeroSection slides={slides} />

      <main
        id='restaurant-discovery'
        className='relative z-20 mx-auto flex w-full max-w-[1280px] flex-col px-5 sm:px-8 lg:px-10'
      >
        <section className='py-6 md:py-12'>
          <CategoryGrid onSelect={setActiveList} />
        </section>

        <div className='flex flex-col gap-4 pb-12 pt-6 md:gap-8 md:pb-25 md:pt-0'>
          <div className='flex flex-row justify-between'>
            <h2 className='text-xl font-semibold leading-9 text-neutral-900 md:text-[32px] md:leading-10.5'>
              {titleText}
            </h2>
            <button
              className='cursor-pointer text-[15px] font-extrabold leading-normal text-primary-100 md:text-lg md:leading-8'
              onClick={() => navigate('/category')}
            >
              See All
            </button>
          </div>

          <div className='flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-x-5 md:gap-y-5'>
            <RestaurantList
              activeList={activeList}
              titleText={titleText}
              isLoading={isLoading}
              isError={isError}
              errorMessage={errorMessage}
              shouldLogin={shouldLogin}
              items={items}
            />
          </div>

          <LoadMoreButton
            activeList={activeList}
            hasNextPage={paginatedQuery?.hasNextPage ?? false}
            isFetchingNextPage={paginatedQuery?.isFetchingNextPage ?? false}
            onLoadMore={() => paginatedQuery?.fetchNextPage()}
          />
        </div>
      </main>
    </>
  );
}
