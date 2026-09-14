import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '@/app/store';
import { clearKeyword } from '@/features/search/searchSlice';
import HeroSection from './components/HeroSection';
import SearchSection from './components/SearchSection';
import CategoryGrid from './components/CategoryGrid';
import RestaurantList from './components/RestaurantList';
import LoadMoreButton from './components/LoadMoreButton';
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
      return 'All Restaurant';

    case 'nearby':
      return `Nearby ( ${nearbyRangeKm} km Range )`;

    case 'discount':
      return 'Discount';

    case 'delivery':
      return 'Delivery';

    case 'lunch':
      return 'Lunch';

    case 'search':
      return `Search Result of "${keyword.trim()}"`;

    default:
      return 'Restaurants';
  }
};

const getToken = () =>
  localStorage.getItem('auth_token') ?? sessionStorage.getItem('auth_token');

export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const keyword = useSelector((state: RootState) => state.search.keyword);
  const [activeList, setActiveList] = useState<ActiveList>(
    getToken() ? 'recommended' : 'all-restaurants',
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
    recommendedQuery,
    bestSellerQuery,
    allRestaurantsQuery,
    nearbyQuery,
    nearbyRangeKm,
  } = useActiveListData(resolvedActiveList, keyword);

  const slides = recommendedQuery.data?.data?.recommendations ?? [];

  const paginatedQuery =
    resolvedActiveList === 'best-seller'
      ? bestSellerQuery
      : resolvedActiveList === 'all-restaurants'
        ? allRestaurantsQuery
        : resolvedActiveList === 'nearby'
          ? nearbyQuery
          : null;

  const titleText = getTitle(resolvedActiveList, keyword, nearbyRangeKm);

  return (
    <div className='w-full overflow-x-hidden bg-white antialiased'>
      <HeroSection slides={slides} />
      <main
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
            <h2 className='text-xl font-bold tracking-tight text-neutral-900 md:text-3xl'>
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
              activeList={resolvedActiveList}
              titleText={titleText}
              isLoading={isLoading}
              isError={isError}
              errorMessage={errorMessage}
              shouldLogin={shouldLogin}
              items={items}
            />
          </div>

          <LoadMoreButton
            activeList={resolvedActiveList}
            hasNextPage={paginatedQuery?.hasNextPage ?? false}
            isFetchingNextPage={paginatedQuery?.isFetchingNextPage ?? false}
            onLoadMore={() => paginatedQuery?.fetchNextPage()}
          />
        </div>
      </main>
    </div>
  );
}
