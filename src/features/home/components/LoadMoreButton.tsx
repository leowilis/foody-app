import type { ActiveList } from '../types';

interface LoadMoreButtonProps {
  activeList: ActiveList;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  onLoadMore: () => void;
}

const PAGINATED_LISTS = [
  'best-seller',
  'all-restaurants',
] as const satisfies readonly ActiveList[];

// Renders pagination controls for restaurant lists that support more results.
export default function LoadMoreButton({
  activeList,
  hasNextPage,
  isFetchingNextPage,
  isFetchNextPageError,
  onLoadMore,
}: LoadMoreButtonProps) {
  const isPaginated = PAGINATED_LISTS.includes(
    activeList as (typeof PAGINATED_LISTS)[number],
  );

  if (!isPaginated) {
    return null;
  }

  if (!hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
    return (
      <div className='flex w-full items-center justify-center py-6'>
        <p className='text-xs font-semibold uppercase tracking-[0.2em] text-text-muted'>
          You&apos;ve reached the end of the list
        </p>
      </div>
    );
  }

  const label = isFetchingNextPage
    ? 'Loading more restaurants...'
    : isFetchNextPageError
      ? 'Retry loading restaurants'
      : 'Show more';

  return (
    <div className='flex w-full items-center justify-center pb-12 pt-8'>
      <button
        type='button'
        disabled={isFetchingNextPage || (!hasNextPage && !isFetchNextPageError)}
        aria-busy={isFetchingNextPage}
        onClick={onLoadMore}
        className='h-11 min-w-[160px] rounded-pill border border-border bg-surface px-6 text-sm font-bold tracking-tight text-text outline-none transition-all focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:ring-offset-2 focus-visible:ring-offset-background enabled:cursor-pointer enabled:hover:border-border-strong enabled:hover:bg-surface-subtle enabled:active:scale-95 disabled:cursor-not-allowed disabled:border-border disabled:bg-surface-subtle disabled:text-text-muted'
      >
        {label}
      </button>
    </div>
  );
}
