import type { ActiveList } from '../types';

interface LoadMoreButtonProps {
  activeList: ActiveList;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

const PAGINATED_LISTS = [
  'best-seller',
  'all-restaurants',
  'nearby',
] as const satisfies readonly ActiveList[];

export default function LoadMoreButton({
  activeList,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: LoadMoreButtonProps) {
  const isPaginated = PAGINATED_LISTS.includes(
    activeList as (typeof PAGINATED_LISTS)[number],
  );

  if (!isPaginated) {
    return null;
  }

  if (!hasNextPage && !isFetchingNextPage) {
    return (
      <div className='flex w-full items-center justify-center py-6'>
        <p className='text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400'>
          You&apos;ve reached the end of the list
        </p>
      </div>
    );
  }

  const label = isFetchingNextPage ? 'Loading...' : 'Show more';

  return (
    <div className='flex w-full items-center justify-center pb-12 pt-8'>
      <button
        type='button'
        disabled={isFetchingNextPage}
        aria-busy={isFetchingNextPage}
        onClick={onLoadMore}
        className='h-11 min-w-[160px] rounded-full bg-white px-6 text-sm font-bold tracking-tight text-neutral-900 ring-1 ring-inset ring-neutral-300 outline-none transition-all focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:ring-offset-2 enabled:cursor-pointer enabled:hover:bg-neutral-50 enabled:active:scale-95 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400'
      >
        {label}
      </button>
    </div>
  );
}
