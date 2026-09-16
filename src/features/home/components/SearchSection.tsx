import { Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { setKeyword } from '@/features/search/searchSlice';

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
          className='mt-2 text-2xl font-black tracking-[-0.035em] text-neutral-950 sm:text-3xl'
        >
          What are you craving?
        </h2>

        <p className='mx-auto mt-2 max-w-xl text-sm leading-6 text-neutral-500 sm:text-base'>
          Search restaurants, dishes, or your favorite food.
        </p>

        <form role='search' aria-label='Restaurant search' className='mt-7'>
          <div className='group relative mx-auto w-full max-w-2xl'>
            <Search
              aria-hidden='true'
              className='pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400 transition-colors duration-200 group-focus-within:text-primary-100'
            />

            <input
              type='search'
              name='restaurant-search'
              value={keyword}
              onChange={(event) => dispatch(setKeyword(event.target.value))}
              placeholder='Search restaurant or food...'
              aria-label='Search restaurant or food'
              autoComplete='off'
              className='h-14 w-full rounded-full border border-neutral-200 bg-white pl-14 pr-6 text-sm font-medium text-neutral-900 shadow-[0_10px_35px_rgba(0,0,0,0.06)] outline-none transition-all duration-200 placeholder:text-neutral-400 hover:border-neutral-300 focus:border-primary-100 focus:shadow-[0_14px_40px_rgba(0,0,0,0.08)] focus:ring-4 focus:ring-primary-100/10 sm:h-16 sm:text-base'
            />
          </div>
        </form>
      </div>
    </section>
  );
}
