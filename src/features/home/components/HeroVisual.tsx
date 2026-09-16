import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, MapPin, Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { HERO_CONFIG } from '../constants/hero.constants';
import type { RecommendedItem } from '../types';

interface HeroVisualProps {
  slides: RecommendedItem[];
}

export default function HeroVisual({ slides }: HeroVisualProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
    },
    [
      Autoplay({
        delay: HERO_CONFIG.autoplayDelay,
        stopOnInteraction: false,
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
          image: item.images[0],
          name: item.name,
          category: item.category,
          place: item.place,
          rating: item.star,
        })),
    [slides],
  );

  useEffect(() => {
    if (!emblaApi) {
      return;
    }
    const handleSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    handleSelect();
    emblaApi.on('select', handleSelect);

    return () => {
      emblaApi.off('select', handleSelect);
    };
  }, [emblaApi]);

  if (heroSlides.length === 0) {
    return (
      <div className='relative mx-auto w-full max-w-2xl'>
        <div className='flex aspect-[4/3] items-center justify-center rounded-[40px] bg-neutral-100'>
          <span className='text-sm font-semibold text-neutral-400'>
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
      <div className='absolute -top-5 right-4 z-20 flex items-center gap-3 rounded-2xl border border-white/70 bg-white/95 px-4 py-3 shadow-[0_12px_35px_rgba(0,0,0,0.1)] backdrop-blur-md sm:right-8'>
        <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50'>
          <Star
            aria-hidden='true'
            className='h-5 w-5 fill-orange-400 text-orange-400'
          />
        </span>

        <div>
          <p className='text-xs font-extrabold text-neutral-900'>Top Rated</p>
          <p className='mt-0.5 text-[11px] font-medium text-neutral-400'>
            {activeSlide.rating.toFixed(1)} rating
          </p>
        </div>
      </div>

      {/* Food image */}
      <div
        ref={emblaRef}
        className='overflow-hidden rounded-[40px] shadow-[0_24px_60px_rgba(0,0,0,0.12)]'
      >
        <div className='flex'>
          {heroSlides.map((slide, index) => (
            <div
              key={`${slide.image}-${index}`}
              className='relative min-w-0 flex-[0_0_100%]'
            >
              <div className='aspect-[4/3] w-full bg-neutral-100'>
                <img
                  src={slide.image}
                  alt={slide.name}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  className='h-full w-full object-cover transition-transform duration-700'
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

                <div className='flex shrink-0 items-center gap-1 rounded-full bg-white/95 px-3 py-2 text-xs font-extrabold text-neutral-900 shadow-lg backdrop-blur'>
                  <Star
                    aria-hidden='true'
                    className='h-3.5 w-3.5 fill-orange-400 text-orange-400'
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
                key={`${slide.name}-${index}`}
                type='button'
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Go to hero slide ${index + 1}`}
                aria-current={index === selectedIndex ? 'true' : undefined}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? 'w-8 bg-primary-100'
                    : 'w-1.5 bg-neutral-300'
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
              className='flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-900 shadow-sm transition-all hover:-translate-x-0.5 hover:border-neutral-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-100'
            >
              <ChevronLeft aria-hidden='true' className='h-4 w-4' />
            </button>

            <button
              type='button'
              onClick={() => emblaApi?.scrollNext()}
              aria-label='Next hero slide'
              className='flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-900 shadow-sm transition-all hover:translate-x-0.5 hover:border-neutral-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-100'
            >
              <ChevronRight aria-hidden='true' className='h-4 w-4' />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
