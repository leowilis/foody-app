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
                    <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />
                  </div>
                )),
              )}
            </div>
          </div>
        ) : (
          <div
            className='absolute inset-0 bg-cover bg-center bg-no-repeat'
            style={{ backgroundImage: `url('/images/common/burger-hero.svg')` }}
          />
        )}

        <div className='absolute inset-0 z-10 bg-linear-to-t from-black/80 via-black/40 to-transparent md:hidden' />
        <div className='absolute inset-0 z-10 hidden bg-linear-to-t from-black to-transparent md:block' />
      </div>

      <div className='absolute bottom-16 z-10 flex w-full flex-col items-center justify-center gap-4 px-4 text-center md:bottom-24'>
        <div className='flex flex-col gap-6 md:gap-10'>
          <div className='flex flex-col gap-1 md:gap-2'>
            <h1 className='text-[36px] font-extrabold leading-11 text-white md:text-[48px] md:leading-15'>
              Explore Culinary Experiences
            </h1>
            <p className='text-[18px] font-bold leading-8 text-white -tracking-[0.03em] md:text-[24px] md:leading-9 md:tracking-normal'>
              Search and refine your choice to discover the perfect restaurant.
            </p>
          </div>

          <div className='relative w-full'>
            <img
              src={Search}
              alt=''
              className='absolute left-4 top-4 z-50 h-6 w-6'
            />
            <input
              id='searchInput'
              name='searchInput'
              type='text'
              value={keyword}
              onChange={(e) => onSearch(e.target.value)}
              placeholder='Search restaurants, food and drink'
              className='h-14 w-full rounded-2xl bg-white pl-13 text-[14px] leading-7 text-black -tracking-[0.02em] placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-white md:text-[16px] md:leading-7.5'
            />
          </div>
        </div>
      </div>
    </>
  );
}
