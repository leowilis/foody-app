import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  const images = useMemo(
    () =>
      slides.flatMap((item) =>
        item.images.map((src) => ({
          src,
          alt: item.name,
        })),
      ),
    [slides],
  );

  useEffect(() => {
    if (!emblaApi) return;

    const handleSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    handleSelect();
    emblaApi.on('select', handleSelect);
    return () => {
      emblaApi.off('select', handleSelect);
    };
  }, [emblaApi]);

  if (images.length === 0) {
    return (
      <div className='flex aspect-[4/3] w-full items-center justify-center rounded-[32px] bg-neutral-100'>
        <span className='text-sm font-medium text-neutral-400'>
          Discover delicious food
        </span>
      </div>
    );
  }

  return (
    <div className='relative w-full'>
      <div ref={emblaRef} className='overflow-hidden rounded-[32px]'>
        <div className='flex'>
          {images.map((image, index) => (
            <div
              key={`${image.src}-${index}`}
              className='min-w-0 flex-[0_0_100%]'
            >
              <img
                src={image.src}
                alt={image.alt}
                className='h-[300px] w-full object-cover sm:h-[380px] lg:h-[500px]'
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className='absolute bottom-5 left-5 right-5 flex items-center justify-between'>
        <div className='flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 backdrop-blur-sm'>
          {images.map((_, index) => (
            <button
              key={index}
              type='button'
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selectedIndex ? 'true' : undefined}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? 'w-6 bg-primary-100'
                  : 'w-1.5 bg-neutral-300'
              }`}
            />
          ))}
        </div>

        <div className='flex gap-2'>
          <button
            type='button'
            onClick={() => emblaApi?.scrollPrev()}
            aria-label='Previous slide'
            className='flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-900 backdrop-blur-sm transition-colors hover:bg-white'
          >
            <ChevronLeft aria-hidden='true' className='h-4 w-4' />
          </button>

          <button
            type='button'
            onClick={() => emblaApi?.scrollNext()}
            aria-label='Next slide'
            className='flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-900 backdrop-blur-sm transition-colors hover:bg-white'
          >
            <ChevronRight aria-hidden='true' className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  );
}
