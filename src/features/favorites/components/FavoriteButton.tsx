import { Heart } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';

interface FavoriteButtonProps {
  readonly restaurantId: number;
  readonly restaurantName: string;
  readonly className?: string;
}

// Toggles a restaurant's favorite status with an accessible button.
export default function FavoriteButton({
  restaurantId,
  restaurantName,
  className = '',
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(restaurantId);

  const label = favorite
    ? `Remove ${restaurantName} from favorites`
    : `Add ${restaurantName} to favorites`;

  return (
    <button
      type='button'
      aria-label={label}
      aria-pressed={favorite}
      title={label}
      onClick={() => toggleFavorite(restaurantId)}
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-text-secondary outline-none transition-colors hover:border-primary-100 hover:text-primary-100 focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        favorite ? 'text-primary-100' : ''
      } ${className}`}
    >
      <Heart
        aria-hidden='true'
        className={`h-5 w-5 transition-colors ${
          favorite ? 'fill-primary-100 text-primary-100' : ''
        }`}
      />
    </button>
  );
}
