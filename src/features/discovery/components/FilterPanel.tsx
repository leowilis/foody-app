import { useState } from 'react';
import type { RestaurantDiscoveryFilters } from '../types';

interface FilterPanelProps {
  readonly filters: RestaurantDiscoveryFilters;
  readonly onApply: (filters: RestaurantDiscoveryFilters) => void;
  readonly onClear: () => void;
}

interface NumberParseOptions {
  readonly max?: number;
  readonly integer?: boolean;
}

const parseNonNegativeNumber = (
  value: string,
  options: NumberParseOptions = {},
): number | undefined => {
  if (value.trim() === '') {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return undefined;
  }

  if (options.integer && !Number.isInteger(parsed)) {
    return undefined;
  }

  if (options.max !== undefined && parsed > options.max) {
    return undefined;
  }

  return parsed;
};

// Provides controls for restaurant discovery filters.
export default function FilterPanel({
  filters,
  onApply,
  onClear,
}: FilterPanelProps) {
  const [range, setRange] = useState(filters.range?.toString() ?? '');
  const [priceMin, setPriceMin] = useState(filters.priceMin?.toString() ?? '');
  const [priceMax, setPriceMax] = useState(filters.priceMax?.toString() ?? '');
  const [rating, setRating] = useState(filters.rating?.toString() ?? '');
  const [validationError, setValidationError] = useState('');

  const handleApply = () => {
    const parsedRange = parseNonNegativeNumber(range);
    const parsedPriceMin = parseNonNegativeNumber(priceMin, {
      integer: true,
    });
    const parsedPriceMax = parseNonNegativeNumber(priceMax, {
      integer: true,
    });
    const parsedRating = parseNonNegativeNumber(rating, { max: 5 });

    const hasInvalidValue =
      (range.trim() !== '' && parsedRange === undefined) ||
      (priceMin.trim() !== '' && parsedPriceMin === undefined) ||
      (priceMax.trim() !== '' && parsedPriceMax === undefined) ||
      (rating.trim() !== '' && parsedRating === undefined);

    if (hasInvalidValue) {
      setValidationError(
        'Enter valid values. Prices must be whole numbers and rating must be between 0 and 5.',
      );
      return;
    }

    if (
      parsedPriceMin !== undefined &&
      parsedPriceMax !== undefined &&
      parsedPriceMin > parsedPriceMax
    ) {
      setValidationError('Minimum price cannot be greater than maximum price.');
      return;
    }

    setValidationError('');

    onApply({
      ...filters,
      range: parsedRange,
      priceMin: parsedPriceMin,
      priceMax: parsedPriceMax,
      rating: parsedRating,
    });
  };

  const handleClear = () => {
    setRange('');
    setPriceMin('');
    setPriceMax('');
    setRating('');
    setValidationError('');
    onClear();
  };

  return (
    <section
      aria-labelledby='discovery-filter-heading'
      className='rounded-3xl border border-border bg-surface p-5'
    >
      <div className='flex items-center justify-between gap-4'>
        <div>
          <p className='text-xs font-bold uppercase tracking-[0.18em] text-primary-100'>
            Refine
          </p>

          <h2
            id='discovery-filter-heading'
            className='mt-1 text-lg font-bold text-text'
          >
            Find the right restaurant
          </h2>
        </div>

        <button
          type='button'
          onClick={handleClear}
          className='text-sm font-semibold text-text-secondary transition-colors hover:text-primary-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface'
        >
          Clear
        </button>
      </div>

      <div className='mt-5 grid gap-4 sm:grid-cols-2'>
        <label className='grid gap-2'>
          <span className='text-sm font-semibold text-text'>Distance (km)</span>

          <input
            type='number'
            min='0'
            value={range}
            onChange={(event) => {
              setRange(event.target.value);
              setValidationError('');
            }}
            placeholder='Any distance'
            className='rounded-xl border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
          />
        </label>

        <label className='grid gap-2'>
          <span className='text-sm font-semibold text-text'>
            Minimum rating
          </span>

          <input
            type='number'
            min='0'
            max='5'
            step='0.1'
            value={rating}
            onChange={(event) => {
              setRating(event.target.value);
              setValidationError('');
            }}
            placeholder='Any rating'
            className='rounded-xl border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
          />
        </label>

        <label className='grid gap-2'>
          <span className='text-sm font-semibold text-text'>Minimum price</span>

          <input
            type='number'
            min='0'
            value={priceMin}
            onChange={(event) => {
              setPriceMin(event.target.value);
              setValidationError('');
            }}
            placeholder='No minimum'
            className='rounded-xl border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
          />
        </label>

        <label className='grid gap-2'>
          <span className='text-sm font-semibold text-text'>Maximum price</span>

          <input
            type='number'
            min='0'
            value={priceMax}
            onChange={(event) => {
              setPriceMax(event.target.value);
              setValidationError('');
            }}
            placeholder='No maximum'
            className='rounded-xl border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
          />
        </label>
      </div>

      {validationError && (
        <p role='alert' className='mt-4 text-sm text-error'>
          {validationError}
        </p>
      )}

      <button
        type='button'
        onClick={handleApply}
        className='mt-5 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface'
      >
        Apply filters
      </button>
    </section>
  );
}
