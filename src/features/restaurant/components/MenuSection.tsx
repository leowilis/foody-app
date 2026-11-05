import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { CartHandlers } from '@/features/cart/hooks/useCartHandlers';
import type { CartItem } from '@/features/cart/types';
import type { MenuFilter, MenuItem } from '../schemas/restaurantSchema';
import MenuCard from './MenuCard';

interface MenuSectionProps {
  menus: readonly MenuItem[];
  menuFilter: MenuFilter;
  onFilterChange: (filter: MenuFilter) => void;
  restaurantId: number;
  restaurantName: string;
  cartItems: CartItem[];
  handlers: CartHandlers;
  hasMore: boolean;
  isFetching: boolean;
  onShowMore: () => void;
}

const FILTER_BUTTONS: readonly {
  key: MenuFilter;
  label: string;
}[] = [
  { key: 'all', label: 'All Menu' },
  { key: 'food', label: 'Food' },
  { key: 'drink', label: 'Drink' },
];

// Renders restaurant menu filters, menu cards, and pagination controls.
export default function MenuSection({
  menus,
  menuFilter,
  onFilterChange,
  restaurantId,
  restaurantName,
  cartItems,
  handlers,
  hasMore,
  isFetching,
  onShowMore,
}: MenuSectionProps) {
  const filteredMenus = menus.filter((menu) =>
    menuFilter === 'all' ? true : menu.type === menuFilter,
  );

  return (
    <section className='flex flex-col gap-4 text-text'>
      <h2 className='text-[24px] font-extrabold leading-9'>Menu</h2>

      <div className='flex flex-row gap-2 md:gap-3'>
        {FILTER_BUTTONS.map(({ key, label }) => {
          const isActive = menuFilter === key;

          return (
            <button
              key={key}
              type='button'
              onClick={() => onFilterChange(key)}
              aria-pressed={isActive}
              className={`h-10 cursor-pointer rounded-pill px-4 py-2 text-[14px] font-bold leading-7 ring-1 ring-inset -tracking-[0.02em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:h-11.5 md:text-[16px] md:leading-7.5 ${
                isActive
                  ? 'bg-primary-100/10 text-primary-100 ring-primary-100'
                  : 'text-text ring-border-strong hover:bg-surface-subtle'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {filteredMenus.length === 0 ? (
        <Alert>
          <AlertTitle>No menu available</AlertTitle>

          <AlertDescription>
            No items found for this category. Try a different filter.
          </AlertDescription>
        </Alert>
      ) : (
        <div className='grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-4 md:gap-x-5 md:gap-y-6'>
          {filteredMenus.map((menu) => (
            <MenuCard
              key={menu.id}
              menu={menu}
              restaurantId={restaurantId}
              restaurantName={restaurantName}
              cartItems={cartItems}
              handlers={handlers}
            />
          ))}
        </div>
      )}

      <div className='flex w-full items-center justify-center pb-4 md:pb-0'>
        <button
          type='button'
          disabled={!hasMore || isFetching}
          onClick={onShowMore}
          className={`h-10 w-40 rounded-pill text-[14px] font-bold leading-7 ring-1 ring-inset ring-border-strong -tracking-[0.02em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            !hasMore || isFetching
              ? 'cursor-not-allowed text-text-muted'
              : 'cursor-pointer text-text hover:bg-surface-subtle'
          }`}
        >
          {!hasMore ? 'No More Data' : isFetching ? 'Loading...' : 'Show More'}
        </button>
      </div>
    </section>
  );
}
