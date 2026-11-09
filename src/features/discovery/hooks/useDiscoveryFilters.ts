import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { RestaurantDiscoveryFilters } from '../types';

const parseDiscoveryNumber = (
  value: string | null,
  options?: {
    readonly min?: number;
    readonly max?: number;
    readonly integer?: boolean;
  },
): number | undefined => {
  if (value === null || value === '') {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  if (options?.integer && !Number.isInteger(parsed)) {
    return undefined;
  }

  if (options?.min !== undefined && parsed < options.min) {
    return undefined;
  }

  if (options?.max !== undefined && parsed > options.max) {
    return undefined;
  }

  return parsed;
};

// Manages discovery filters and pagination through URL search params.
export function useDiscoveryFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<RestaurantDiscoveryFilters>(() => {
    const location = searchParams.get('location')?.trim();
    const category = searchParams.get('category')?.trim();

    const priceMin = parseDiscoveryNumber(searchParams.get('priceMin'), {
      min: 0,
      integer: true,
    });

    const priceMax = parseDiscoveryNumber(searchParams.get('priceMax'), {
      min: 0,
      integer: true,
    });

    const hasInvalidPriceRange =
      priceMin !== undefined && priceMax !== undefined && priceMin > priceMax;

    return {
      location: location || undefined,
      range: parseDiscoveryNumber(searchParams.get('range'), {
        min: 0,
      }),
      priceMin: hasInvalidPriceRange ? undefined : priceMin,
      priceMax: hasInvalidPriceRange ? undefined : priceMax,
      rating: parseDiscoveryNumber(searchParams.get('rating'), {
        min: 0,
        max: 5,
      }),
      category: category || undefined,
    };
  }, [searchParams]);

  const page =
    parseDiscoveryNumber(searchParams.get('page'), {
      min: 1,
      integer: true,
    }) ?? 1;

  const updateFilters = useCallback(
    (nextFilters: RestaurantDiscoveryFilters) => {
      const nextParams = new URLSearchParams();

      Object.entries(nextFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          nextParams.set(key, String(value));
        }
      });

      nextParams.set('page', '1');
      setSearchParams(nextParams);
    },
    [setSearchParams],
  );

  const setPage = useCallback(
    (nextPage: number) => {
      if (!Number.isInteger(nextPage) || nextPage < 1) {
        return;
      }

      const nextParams = new URLSearchParams(searchParams);

      nextParams.set('page', String(nextPage));
      setSearchParams(nextParams);
    },
    [searchParams, setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  return {
    filters,
    page,
    updateFilters,
    setPage,
    clearFilters,
  };
}
