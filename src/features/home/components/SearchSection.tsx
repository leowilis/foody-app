import { Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { setKeyword } from '@/features/search/searchSlice';

export default function SearchSection() {
  const dispatch = useDispatch();
  const keyword = useSelector((state: RootState) => state.search.keyword);

  return (
    <form role='search' aria-label='Restaurant search' className='w-full'>
      <div className='relative mx-auto w-full max-w-2xl'>
        <Search
          aria-hidden='true'
          className='pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400'
        />

        <input
          type='search'
          name='restaurant-search'
          value={keyword}
          onChange={(event) => dispatch(setKeyword(event.target.value))}
          placeholder='Search restaurant or food...'
          aria-label='Search restaurant or food'
          autoComplete='off'
          className='h-14 w-full rounded-full border border-neutral-200 bg-white pl-13 pr-5 text-sm font-medium text-neutral-900 shadow-[0_8px_30px_rgba(0,0,0,0.06)] outline-none transition placeholder:text-neutral-400 focus:border-primary-100 focus:ring-4 focus:ring-primary-100/10'
        />
      </div>
    </form>
  );
}
