import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Search from '@/assets/search.svg';
import type { RecommendedItem } from '../types';
import React from 'react';

interface HeroSectionProps {
  keyword: string;
  onSearch: (value: string) => void;
  slides: RecommendedItem[];
}

/** Hero banner with auto-sliding restaurant images and search input. */
export default function HeroSection({
  keyword,
  onSearch,
  slides,
}: HeroSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const allImages = React.useMemo(
    () =>
      slides.flatMap((item) =>
        item.images.map((img) => ({ src: img, alt: item.name })),
      ),
    [slides],
  );

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  return (
    <div className='w-full bg-white px-4 pt-4 md:px-8 md:pt-6'>
      {/* Slider */}
      {allImages.length > 0 && (
        <>
          <div className='overflow-hidden rounded-2xl' ref={emblaRef}>
            <div className='flex'>
              {allImages.map((image, i) => (
                <div key={i} className='min-w-full flex-shrink-0'>
                  <img
                    src={image.src}
                    alt={image.alt}
                    className='h-[250px] w-full object-cover md:h-[300px]'
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className='mt-4 flex justify-center gap-1.5'>
            {allImages.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === selectedIndex
                    ? 'w-5 bg-red-500'
                    : 'w-1.5 bg-neutral-300'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Search bar below dots */}
      <div className='mt-5 relative w-full'>
        <img
          src={Search}
          alt=''
          className='absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 opacity-40'
        />
        <input
          id='searchInput'
          name='searchInput'
          type='text'
          value={keyword}
          onChange={(e) => onSearch(e.target.value)}
          placeholder='Search restaurants, food and drink'
          className='h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-100 pl-11 pr-4 text-[14px] text-black placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-400/40 md:h-13 md:text-[15px]'
        />
      </div>
    </div>
  );
}
