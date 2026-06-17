import type { ActiveList } from '../types';

interface LoadMoreButtonProps {
  activeList: ActiveList;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

const PAGINATED_LISTS: ActiveList[] = [
  'best-seller',
  'all-restaurants',
  'nearby',
];

// "Show more" / "No more data" button for paginated lists.
export default function LoadMoreButton({
  activeList,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: LoadMoreButtonProps) {
  const isPaginated = PAGINATED_LISTS.includes(activeList);
  const isDisabled = !isPaginated || !hasNextPage;

  const label = isDisabled
    ? 'No more data'
    : isFetchingNextPage
      ? 'Loading...'
      : 'Show More';

  return (
    <div className='flex w-full flex-1 flex-row items-center justify-center'>
      <button
        disabled={isDisabled}
        onClick={onLoadMore}
        className={`h-10 w-40 cursor-pointer rounded-[100px] text-[14px] font-bold leading-7 ring-1 ring-inset ring-neutral-300 -tracking-[0.02em] ${
          isDisabled
            ? 'cursor-not-allowed text-neutral-400'
            : 'text-neutral-950'
        }`}
      >
        {label}
      </button>
    </div>
  );
}
