import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { HERO_CONFIG } from '../constants/hero.constants';
import { HeroRatingBadge, HeroSlideCard } from './HeroVisual';
import type { HeroSlide } from './HeroVisual';

interface HeroCarouselProps {
  readonly slides: readonly HeroSlide[];
}

// Renders the interactive restaurant carousel.
export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
    },
    [
      Autoplay({
        delay: HERO_CONFIG.autoplayDelay,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
        playOnInit: false,
      }),
    ],
  );

  // Track changes to the user's reduced-motion preference.
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handlePreferenceChange = () => {
      setShouldReduceMotion(mediaQuery.matches);
    };

    handlePreferenceChange();
    mediaQuery.addEventListener('change', handlePreferenceChange);

    return () => {
      mediaQuery.removeEventListener('change', handlePreferenceChange);
    };
  }, []);

  // Control autoplay while respecting motion preferences and user input.
  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = emblaApi.plugins().autoplay;

    if (shouldReduceMotion || isPaused) {
      autoplay?.stop();
      return;
    }

    autoplay?.play();
  }, [emblaApi, shouldReduceMotion, isPaused]);

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

  if (slides.length === 0) return null;

  const activeIndex = Math.min(selectedIndex, slides.length - 1);
  const activeSlide = slides[activeIndex];

  if (!activeSlide) return null;

  const autoplayDisabled = shouldReduceMotion || isPaused;

  const handleAutoplayToggle = () => {
    setIsPaused((previous) => !previous);
  };

  return (
    <div
      role='region'
      aria-roledescription='carousel'
      aria-label='Featured restaurants'
      className='relative mx-auto w-full max-w-2xl'
    >
      <HeroRatingBadge rating={activeSlide.rating} />

      <div
        ref={emblaRef}
        className='overflow-hidden rounded-[40px] shadow-foody-lg'
      >
        <div className='flex'>
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              role='group'
              aria-roledescription='slide'
              aria-label={`${index + 1} of ${slides.length}`}
              aria-hidden={index !== activeIndex}
              className='relative min-w-0 flex-[0_0_100%]'
            >
              <HeroSlideCard slide={slide} priority={index === 0} />
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <div className='mt-5 flex h-10 items-center justify-between px-1 sm:px-2'>
          {/* Carousel controls */}
          <div className='flex items-center gap-2'>
            <button
              type='button'
              onClick={handleAutoplayToggle}
              disabled={shouldReduceMotion}
              aria-label={
                shouldReduceMotion
                  ? 'Automatic slide rotation disabled by reduced motion preference'
                  : isPaused
                    ? 'Play automatic slide rotation'
                    : 'Pause automatic slide rotation'
              }
              className='flex h-10 w-10 items-center justify-center rounded-pill border border-border bg-surface text-text shadow-foody-sm outline-none transition-all hover:border-border-strong hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50'
            >
              {autoplayDisabled ? (
                <Play aria-hidden='true' className='h-4 w-4' />
              ) : (
                <Pause aria-hidden='true' className='h-4 w-4' />
              )}
            </button>

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

          {/* Slide indicators */}
          <div className='flex items-center gap-2'>
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type='button'
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Go to hero slide ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : undefined}
                className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:ring-offset-2 focus-visible:ring-offset-background'
              >
                <span
                  aria-hidden='true'
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'w-8 bg-primary-100'
                      : 'w-1.5 bg-border-strong'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
