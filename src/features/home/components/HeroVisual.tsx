import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, MapPin, Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { HERO_CONFIG } from '../constants/hero.constants';
import type { RecommendedItem } from '../types';

interface HeroVisualProps {
  readonly slides: readonly RecommendedItem[];
}

// Renders the featured restaurant carousel used in the hero section.
export default function HeroVisual({ slides }: HeroVisualProps) {
  const shouldReduceMotion = useReducedMotion();

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
    },
    [
      Autoplay({
        delay: HERO_CONFIG.autoplayDelay,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
        playOnInit: false,
      }),
    ],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const heroSlides = useMemo(
    () =>
      slides
        .filter((item) => item.images?.length > 0)
        .slice(0, HERO_CONFIG.visual.maxSlides)
        .map((item) => ({
          id: item.id,
          image: item.images[0],
          name: item.name,
          category: item.category,
          place: item.place,
          rating: item.star,
        })),
    [slides],
  );

  // Respect the user's reduced-motion preference.
  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = emblaApi.plugins().autoplay;

    if (shouldReduceMotion !== false) {
      autoplay?.stop();
      return;
    }

    autoplay?.play();
  }, [emblaApi, shouldReduceMotion]);

  // Keep the active slide index synchronized with Embla.
  useEffect(() => {
    if (!emblaApi) return;

    const handleSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    handleSelect();

    emblaApi.on('select', handleSelect);
    emblaApi.on('reInit', handleSelect);

    return () => {
      emblaApi.off('select', handleSelect);
      emblaApi.off('reInit', handleSelect);
    };
  }, [emblaApi]);

  if (heroSlides.length === 0) {
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

  const activeSlide = heroSlides[selectedIndex] ?? heroSlides[0];

  return (
    <div className='relative mx-auto w-full max-w-2xl'>
      {/* Floating rating badge */}
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
            {activeSlide.rating.toFixed(1)} rating
          </p>
        </div>
      </div>

      {/* Food image */}
      <div
        ref={emblaRef}
        className='overflow-hidden rounded-[40px] shadow-foody-lg'
      >
        <div className='flex'>
          {heroSlides.map((slide, index) => (
            <div key={slide.id} className='relative min-w-0 flex-[0_0_100%]'>
              <div className='aspect-[4/3] w-full bg-surface-subtle'>
                <img
                  src={slide.image}
                  alt=''
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  className='h-full w-full object-cover'
                />
              </div>

              {/* Very subtle image gradient */}
              <div
                aria-hidden='true'
                className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent'
              />

              {/* Restaurant info */}
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
          ))}
        </div>
      </div>

      {/* Carousel controls */}
      {heroSlides.length > 1 && (
        <div className='mt-5 flex items-center justify-between px-1 sm:px-2'>
          {/* Indicators */}
          <div className='flex items-center gap-2'>
            {heroSlides.map((slide, index) => (
              <button
                key={slide.id}
                type='button'
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Go to hero slide ${index + 1}`}
                aria-current={index === selectedIndex ? 'true' : undefined}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? 'w-8 bg-primary-100'
                    : 'w-1.5 bg-border-strong'
                }`}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className='flex items-center gap-2'>
            <button
              type='button'
              onClick={() => emblaApi?.scrollPrev()}
              aria-label='Previous hero slide'
              className='flex h-10 w-10 items-center justify-center rounded-pill border border-border bg-surface text-text shadow-foody-sm outline-none transition-all hover:-translate-x-0.5 hover:border-border-strong hover:bg-surface-subtle hover:shadow-foody-md focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:ring-offset-2 focus-visible:ring-offset-background'
            >
              <ChevronLeft aria-hidden='true' className='h-4 w-4' />
            </button>

            <button
              type='button'
              onClick={() => emblaApi?.scrollNext()}
              aria-label='Next hero slide'
              className='flex h-10 w-10 items-center justify-center rounded-pill border border-border bg-surface text-text shadow-foody-sm outline-none transition-all hover:translate-x-0.5 hover:border-border-strong hover:bg-surface-subtle hover:shadow-foody-md focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:ring-offset-2 focus-visible:ring-offset-background'
            >
              <ChevronRight aria-hidden='true' className='h-4 w-4' />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
