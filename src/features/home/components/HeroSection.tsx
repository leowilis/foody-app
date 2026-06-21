import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Search from '@/assets/search.svg';
import type { RecommendedItem } from '../types';

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
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  ]);

  const hasSlides = slides.flatMap((item) => item.images).length > 0;

  return (
    <>
      <div className='relative h-[420px] w-full overflow-hidden md:h-[600px]'>
        {hasSlides ? (
          <div className='h-full w-full' ref={emblaRef}>
            <div className='flex h-full'>
              {slides.flatMap((item) =>
                item.images.map((img, i) => (
                  <div
                    key={`${item.id}-${i}`}
                    className='relative min-w-full flex-shrink-0 h-full'
                  >
                    <img
                      src={img}
                      alt={item.name}
                      className='h-full w-full object-cover object-center'
                    />
                    {/* Gradient overlay per slide agar text tetap terbaca */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20' />
                  </div>
                )),
              )}
            </div>
          </div>
        ) : (
          <div
            className='absolute inset-0 bg-cover bg-center bg-no-repeat'
            style={{ backgroundImage: `url('/assets/burger-hero.svg')` }}
          />
        )}

        <div className='absolute inset-0 z-10 bg-linear-to-t from-black/80 via-black/40 to-transparent md:hidden' />
        <div className='absolute inset-0 z-10 hidden bg-linear-to-t from-black to-transparent md:block' />
      </div>

      <div className='absolute inset-x-0 bottom-0 z-10 flex flex-col gap-3 px-4 pb-6 md:items-center md:pb-10 md:text-center'>
        <div className='flex flex-col gap-0.5 md:gap-10'>
          <div className='flex flex-col gap-1 md:gap-2'>
            <h1 className='text-[24px] font-extrabold leading-tight text-white drop-shadow-md md:text-[40px]'>
              Explore Culinary Experiences
            </h1>
            <p className='text-[13px] font-medium leading-8 text-white/80 drop-shadow-sm md:text-[16px]'>
              Search and refine your choice to discover the perfect restaurant.
            </p>
          </div>

          <div className='relative w-full md:max-w-xl'>
            <img
              src={Search}
              alt=''
              className='absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 opacity-50'
            />
            <input
              id='searchInput'
              name='searchInput'
              type='text'
              value={keyword}
              onChange={(e) => onSearch(e.target.value)}
              placeholder='Search restaurants, food and drink'
              className='h-12 w-full rounded-2xl bg-white/95 pl-12 pr-4 text-[14px] text-black shadow-lg placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/50 md:h-13 md:text-[15px]'
            />
          </div>
        </div>
      </div>
    </>
  );
}
