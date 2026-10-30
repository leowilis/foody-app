import { useCallback, useSyncExternalStore } from 'react';
import {
  FAVORITES_CHANGE_EVENT,
  FAVORITES_STORAGE_KEY,
} from '../constants/favorites.constants';

const EMPTY_FAVORITES: readonly number[] = [];

let cachedRawValue: string | null | undefined;
let cachedFavoriteIds: readonly number[] = EMPTY_FAVORITES;

// Reads favorite IDs from localStorage and caches the parsed result.
function getFavoriteIds(): readonly number[] {
  let rawValue: string | null;

  try {
    rawValue = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
  } catch {
    return EMPTY_FAVORITES;
  }

  if (rawValue === cachedRawValue) {
    return cachedFavoriteIds;
  }

  cachedRawValue = rawValue;

  if (!rawValue) {
    cachedFavoriteIds = EMPTY_FAVORITES;
    return cachedFavoriteIds;
  }

  try {
    const parsed: unknown = JSON.parse(rawValue);

    if (!Array.isArray(parsed)) {
      cachedFavoriteIds = EMPTY_FAVORITES;
      return cachedFavoriteIds;
    }

    cachedFavoriteIds = [
      ...new Set(
        parsed.filter(
          (id): id is number =>
            typeof id === 'number' && Number.isSafeInteger(id) && id > 0,
        ),
      ),
    ];
  } catch {
    cachedFavoriteIds = EMPTY_FAVORITES;
  }

  return cachedFavoriteIds;
}

// Notifies subscribers when favorite IDs change.
function subscribe(onStoreChange: () => void): () => void {
  window.addEventListener(FAVORITES_CHANGE_EVENT, onStoreChange);
  window.addEventListener('storage', onStoreChange);

  return () => {
    window.removeEventListener(FAVORITES_CHANGE_EVENT, onStoreChange);
    window.removeEventListener('storage', onStoreChange);
  };
}

// Returns a stable snapshot for React external-store subscriptions.
function getSnapshot(): readonly number[] {
  return getFavoriteIds();
}

// Returns the initial snapshot for server rendering.
function getServerSnapshot(): readonly number[] {
  return EMPTY_FAVORITES;
}

// Persists favorite IDs and notifies components in the current tab.
function saveFavoriteIds(ids: readonly number[]): void {
  try {
    const uniqueIds = [
      ...new Set(ids.filter((id) => Number.isSafeInteger(id) && id > 0)),
    ];

    const serialized = JSON.stringify(uniqueIds);

    window.localStorage.setItem(FAVORITES_STORAGE_KEY, serialized);

    // Update the snapshot before notifying React subscribers.
    cachedRawValue = serialized;
    cachedFavoriteIds = uniqueIds;

    window.dispatchEvent(new Event(FAVORITES_CHANGE_EVENT));
  } catch {
    // Storage may be unavailable or full.
  }
}

/**
 * Provides shared favorite state and actions for restaurant components.
 * Favorites remain stored after logout.
 */
export function useFavorites() {
  const favoriteIds = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const isFavorite = useCallback(
    (restaurantId: number): boolean => favoriteIds.includes(restaurantId),
    [favoriteIds],
  );

  const toggleFavorite = useCallback((restaurantId: number): void => {
    if (!Number.isSafeInteger(restaurantId) || restaurantId <= 0) {
      return;
    }

    const currentIds = getFavoriteIds();

    const nextIds = currentIds.includes(restaurantId)
      ? currentIds.filter((id) => id !== restaurantId)
      : [...currentIds, restaurantId];

    saveFavoriteIds(nextIds);
  }, []);

  const removeFavorite = useCallback((restaurantId: number): void => {
    if (!Number.isSafeInteger(restaurantId) || restaurantId <= 0) {
      return;
    }

    saveFavoriteIds(getFavoriteIds().filter((id) => id !== restaurantId));
  }, []);

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
    removeFavorite,
  };
}
