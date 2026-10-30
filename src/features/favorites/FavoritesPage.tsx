import { useNavigate } from 'react-router-dom';
import { Heart, RefreshCw, Trash2 } from 'lucide-react';
import { useFavorites } from './hooks/useFavorites';
import RestaurantCard, {
  type RestaurantCardItem,
} from '@/features/home/components/RestaurantCard';
import { useRestaurantDetail } from '@/features/restaurant/hooks/useRestaurantDetail';

function FavoriteRestaurantEntry({ restaurantId }: { restaurantId: number }) {
  const navigate = useNavigate();
  const { detail, isPending, isError, errorMessage, refetch } =
    useRestaurantDetail(String(restaurantId), 1, 1);
  const { removeFavorite } = useFavorites();

  if (isPending) {
    return (
      <div
        aria-label='Loading favorite restaurant'
        className='aspect-[4/3] animate-pulse rounded-[28px] border border-border bg-surface-subtle'
      />
    );
  }

  if (isError || !detail) {
    return (
      <article className='flex min-w-0 flex-col gap-3 rounded-[28px] border border-border bg-surface p-5'>
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0'>
            <h2 className='font-bold text-text'>Restaurant unavailable</h2>
            <p className='mt-1 text-sm text-text-secondary'>
              {errorMessage || 'Restaurant details could not be loaded.'}
            </p>
          </div>

          <button
            type='button'
            onClick={() => removeFavorite(restaurantId)}
            aria-label='Remove unavailable restaurant from favorites'
            title='Remove from favorites'
            className='inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-primary-100 hover:text-primary-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-100'
          >
            <Trash2 aria-hidden='true' className='h-4 w-4' />
          </button>
        </div>

        <button
          type='button'
          onClick={() => void refetch()}
          className='inline-flex w-fit items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-text transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-100'
        >
          <RefreshCw aria-hidden='true' className='h-4 w-4' />
          Try again
        </button>
      </article>
    );
  }

  const item: RestaurantCardItem = {
    id: detail.id,
    name: detail.name,
    star: detail.star,
    place: detail.place,
    logo: detail.logo,
    images: detail.images,
    category: detail.category,
  };

  return (
    <RestaurantCard
      item={item}
      onClick={() => navigate(`/details/${detail.id}`)}
    />
  );
}

// Displays the restaurants saved by the current browser.
export default function FavoritesPage() {
  const { favoriteIds } = useFavorites();

  return (
    <main className='mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
      <header className='mb-8'>
        <div className='flex items-center gap-3'>
          <Heart
            aria-hidden='true'
            className='h-7 w-7 fill-primary-100 text-primary-100'
          />
          <h1 className='text-2xl font-black tracking-tight text-text sm:text-3xl'>
            Favorites
          </h1>
        </div>

        <p className='mt-2 text-sm text-text-secondary sm:text-base'>
          Your saved restaurants, all in one place.
        </p>
      </header>

      {favoriteIds.length === 0 ? (
        <section className='flex min-h-64 flex-col items-center justify-center rounded-[28px] border border-dashed border-border px-6 py-12 text-center'>
          <Heart
            aria-hidden='true'
            className='mb-4 h-10 w-10 text-text-muted'
          />
          <h2 className='text-lg font-bold text-text'>No favorites yet</h2>
          <p className='mt-2 max-w-md text-sm text-text-secondary'>
            Save a restaurant by selecting the heart on its card. It will appear
            here even after you log out.
          </p>

          <button
            type='button'
            onClick={() => window.location.assign('/')}
            className='mt-5 rounded-xl bg-primary-100 px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:ring-offset-2'
          >
            Explore restaurants
          </button>
        </section>
      ) : (
        <>
          <p className='mb-4 text-sm text-text-secondary'>
            {favoriteIds.length} saved{' '}
            {favoriteIds.length === 1 ? 'restaurant' : 'restaurants'}
          </p>

          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {favoriteIds.map((restaurantId) => (
              <FavoriteRestaurantEntry
                key={restaurantId}
                restaurantId={restaurantId}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
