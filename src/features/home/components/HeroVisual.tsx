import { MapPin, Star } from 'lucide-react';

export interface HeroSlide {
  readonly id: number;
  readonly image: string;
  readonly name: string;
  readonly category?: string;
  readonly place: string;
  readonly rating: number;
}

interface HeroVisualProps {
  readonly slides: readonly HeroSlide[];
}

interface HeroSlideCardProps {
  readonly slide: HeroSlide;
  readonly priority?: boolean;
}

// Renders one restaurant slide without carousel dependencies.
export function HeroSlideCard({ slide, priority = false }: HeroSlideCardProps) {
  return (
    <div className='relative aspect-[4/3] w-full bg-surface-subtle'>
      <img
        src={slide.image}
        alt=''
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        className='h-full w-full object-cover'
      />

      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent'
      />

      <div className='absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-7 sm:left-7 sm:right-7'>
        <div className='min-w-0'>
          <p className='mb-1 text-xs font-bold uppercase tracking-[0.16em] text-white/70'>
            {slide.category}
          </p>

          <h2 className='truncate text-xl font-black tracking-tight text-white sm:text-2xl'>
            {slide.name}
          </h2>

          <div className='mt-2 flex items-center gap-2 text-xs font-medium text-white/80'>
            <MapPin aria-hidden='true' className='h-3.5 w-3.5' />
            <span className='truncate'>{slide.place}</span>
          </div>
        </div>

        <div className='flex shrink-0 items-center gap-1 rounded-pill bg-surface/95 px-3 py-2 text-xs font-extrabold text-text shadow-foody-sm backdrop-blur'>
          <Star
            aria-hidden='true'
            className='h-3.5 w-3.5 fill-primary-100 text-primary-100'
          />
          {slide.rating.toFixed(1)}
        </div>
      </div>
    </div>
  );
}

// Displays the rating badge for the active restaurant.
export function HeroRatingBadge({ rating }: { readonly rating: number }) {
  return (
    <div className='absolute -top-5 right-4 z-20 flex items-center gap-3 rounded-2xl border border-border bg-surface/95 px-4 py-3 shadow-foody-md backdrop-blur-md sm:right-8'>
      <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100/10'>
        <Star
          aria-hidden='true'
          className='h-5 w-5 fill-primary-100 text-primary-100'
        />
      </span>

      <div>
        <p className='text-xs font-extrabold text-text'>Top Rated</p>

        <p className='mt-0.5 text-[11px] font-medium text-text-muted'>
          {rating.toFixed(1)} rating
        </p>
      </div>
    </div>
  );
}

// Renders the first restaurant while the interactive carousel loads.
export default function HeroVisual({ slides }: HeroVisualProps) {
  const firstSlide = slides[0];

  if (!firstSlide) {
    return (
      <div className='relative mx-auto w-full max-w-2xl'>
        <div className='flex aspect-[4/3] items-center justify-center rounded-[40px] bg-surface-subtle'>
          <span className='text-sm font-semibold text-text-muted'>
            Discover delicious food
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className='relative mx-auto w-full max-w-2xl'>
      <HeroRatingBadge rating={firstSlide.rating} />

      <div className='overflow-hidden rounded-[40px] shadow-foody-lg'>
        <HeroSlideCard slide={firstSlide} priority />
      </div>
      {slides.length > 1 && <div aria-hidden='true' className='mt-5 h-10' />}
    </div>
  );
}
