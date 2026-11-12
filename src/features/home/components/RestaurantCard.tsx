import { MapPin, Star } from 'lucide-react';
import { useState } from 'react';
import restaurantDummy from '@/assets/restaurant-dummy.webp';
import { getOptimizedImageUrl } from '@/lib/image-url';

const RESTAURANT_IMAGE_WIDTHS = [320, 480, 640, 800] as const;
const RESTAURANT_IMAGE_SIZES = [
  '(min-width: 1600px) 350px',
  '(min-width: 1024px) calc((100vw - 200px) / 4)',
  '(min-width: 768px) calc((100vw - 128px) / 3)',
  '(min-width: 640px) calc((100vw - 64px) / 2)',
  'calc(100vw - 48px)',
].join(', ');

interface ResponsiveImageCandidate {
  readonly src: string;
  readonly srcSet?: string;
}
export interface RestaurantCardItem {
  readonly id: number;
  readonly name: string;
  readonly star: number;
  readonly place: string;
  readonly logo: string;
  readonly images: readonly string[];
  readonly category?: string;
  readonly distance?: number;
}

interface RestaurantCardProps {
  readonly item: RestaurantCardItem;
  readonly onClick: () => void;
}

interface RestaurantCardContentProps extends RestaurantCardProps {
  readonly imageKey: string;
}

function createResponsiveImageCandidate(
  source: string,
): ResponsiveImageCandidate {
  const candidates = RESTAURANT_IMAGE_WIDTHS.map((width) => ({
    src: getOptimizedImageUrl(source, width),
    width,
  }));

  const uniqueCandidates = [
    ...new Map(
      candidates.map((candidate) => [candidate.src, candidate]),
    ).values(),
  ];

  const src = getOptimizedImageUrl(source);

  return {
    src,
    srcSet:
      uniqueCandidates.length > 1
        ? uniqueCandidates
            .map(({ src: url, width }) => `${url} ${width}w`)
            .join(', ')
        : undefined,
  };
}

// Displays a restaurant card with its image, rating, category, and location.
export default function RestaurantCard(props: RestaurantCardProps) {
  const imageKey = [
    props.item.id,
    props.item.images[0] ?? '',
    props.item.logo,
  ].join('-');

  return (
    <RestaurantCardContent key={imageKey} {...props} imageKey={imageKey} />
  );
}

function RestaurantCardContent({ item, onClick }: RestaurantCardContentProps) {
  const imageCandidates = [
    createResponsiveImageCandidate(item.images[0] ?? ''),
    createResponsiveImageCandidate(item.logo),
    createResponsiveImageCandidate(restaurantDummy),
  ].filter(
    (candidate, index, candidates) =>
      Boolean(candidate.src) &&
      candidates.findIndex((item) => item.src === candidate.src) === index,
  );

  const [failedImages, setFailedImages] = useState<ReadonlySet<string>>(
    () => new Set(),
  );

  const image =
    imageCandidates.find((candidate) => !failedImages.has(candidate.src)) ??
    createResponsiveImageCandidate(restaurantDummy);

  const handleImageError = () => {
    setFailedImages((previous) => {
      if (previous.has(image.src)) {
        return previous;
      }

      const next = new Set(previous);
      next.add(image.src);

      return next;
    });
  };

  return (
    <button
      type='button'
      onClick={onClick}
      aria-label={`View details for ${item.name}${
        item.category ? `, ${item.category} restaurant` : ' restaurant'
      } located in ${item.place}`}
      className='group flex w-full cursor-pointer flex-col overflow-hidden rounded-[28px] border border-border bg-surface text-left shadow-foody-md outline-none transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-foody-lg focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none motion-reduce:transition-none'
    >
      <span className='relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-surface-subtle'>
        <img
          src={image.src}
          srcSet={image.srcSet}
          sizes={RESTAURANT_IMAGE_SIZES}
          alt=''
          loading='lazy'
          onError={handleImageError}
          className='h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none'
        />

        <span
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-70'
        />

        {item.category && (
          <span className='absolute left-4 top-4 rounded-pill border border-border/50 bg-surface/95 px-3 py-1.5 shadow-foody-sm backdrop-blur-sm'>
            <span className='block text-[11px] font-extrabold uppercase leading-none tracking-[0.12em] text-text'>
              {item.category}
            </span>
          </span>
        )}
      </span>

      <span className='flex w-full min-w-0 flex-col gap-2.5 p-4 sm:p-5'>
        <span className='flex w-full items-start justify-between gap-3'>
          <span className='min-w-0 truncate text-[17px] font-black tracking-tight text-text'>
            {item.name}
          </span>

          <span className='flex shrink-0 items-center gap-1 rounded-pill bg-primary-100/10 px-2.5 py-1 text-xs font-extrabold text-text'>
            <Star
              aria-hidden='true'
              className='h-3.5 w-3.5 fill-primary-100 text-primary-100'
            />
            {item.star.toFixed(1)}
          </span>
        </span>

        <span className='flex min-w-0 items-center gap-1.5 text-sm text-text-secondary'>
          <MapPin
            aria-hidden='true'
            className='h-3.5 w-3.5 shrink-0 text-text-muted'
          />

          <span className='truncate'>{item.place}</span>

          {item.distance !== undefined &&
            Number.isFinite(item.distance) &&
            item.distance >= 0 && (
              <>
                <span
                  aria-hidden='true'
                  className='shrink-0 font-bold text-border-strong'
                >
                  ·
                </span>

                <span className='shrink-0 font-mono text-text-secondary'>
                  {item.distance} km
                </span>
              </>
            )}
        </span>
      </span>
    </button>
  );
}
