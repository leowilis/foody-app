import { Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { setKeyword } from '@/features/search/searchSlice';
import { SEARCH_CONFIG } from '@/features/search/search.constants';

// Renders the restaurant search field and supporting copy.
export default function SearchSection() {
  const dispatch = useDispatch();
  const keyword = useSelector((state: RootState) => state.search.keyword);

  return (
    <section aria-labelledby='restaurant-search-title' className='relative'>
      <div className='mx-auto max-w-3xl text-center'>
        <p className='text-[11px] font-extrabold uppercase tracking-[0.24em] text-primary-100'>
          Find your next favorite
        </p>

        <h2
          id='restaurant-search-title'
          className='mt-2 text-2xl font-black tracking-[-0.035em] text-text sm:text-3xl'
        >
          What are you craving?
        </h2>

        <p className='mx-auto mt-2 max-w-xl text-sm leading-6 text-text-secondary sm:text-base'>
          Search restaurants, dishes, or your favorite food.
        </p>

        <form
          role='search'
          aria-label='Restaurant search'
          onSubmit={(event) => event.preventDefault()}
          className='mt-7'
        >
          <div className='group relative mx-auto w-full max-w-2xl'>
            <Search
              aria-hidden='true'
              className='pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted transition-colors duration-200 group-focus-within:text-primary-100 motion-reduce:transition-none'
            />

            <input
              type='search'
              name='restaurant-search'
              value={keyword}
              onChange={(event) => dispatch(setKeyword(event.target.value))}
              placeholder='Search restaurant or food...'
              aria-label='Search restaurant or food'
              maxLength={SEARCH_CONFIG.maxQueryLength}
              className='h-14 w-full rounded-pill border border-border bg-surface pl-14 pr-6 text-sm font-medium text-text shadow-foody-md outline-none transition-all duration-200 placeholder:text-text-muted hover:border-border-strong focus:border-primary-100 focus:shadow-foody-lg focus:ring-4 focus:ring-primary-100/10 sm:h-16 sm:text-base motion-reduce:transition-none'
            />
          </div>
        </form>
      </div>
    </section>
  );
}
