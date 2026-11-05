import { useRef, useState } from 'react';
import { RESTAURANT_IMAGE_FALLBACKS } from '../constants/restaurant.constants';

interface ImageGalleryProps {
  images: string[];
  name: string;
}

// Displays restaurant images in a desktop grid and mobile carousel.
export default function ImageGallery({ images, name }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const heroImages = [
    images[0] ?? RESTAURANT_IMAGE_FALLBACKS[0],
    images[1] ?? RESTAURANT_IMAGE_FALLBACKS[1],
    images[2] ?? RESTAURANT_IMAGE_FALLBACKS[2],
    images[3] ?? RESTAURANT_IMAGE_FALLBACKS[3],
  ];
  const mobileImages = images.length > 0 ? images : [heroImages[0]];

  const handleScroll = () => {
    const el = carouselRef.current;
    if (!el || el.clientWidth === 0) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIndex(Math.max(0, Math.min(next, mobileImages.length - 1)));
  };

  return (
    <div className='flex flex-col gap-4'>
      {/* Desktop grid */}
      <div className='hidden h-117.5 md:grid md:grid-cols-2 md:gap-5'>
        <div
          className='h-117.5 rounded-3xl bg-cover bg-center bg-no-repeat'
          style={{ backgroundImage: `url('${heroImages[0]}')` }}
        />
        <div className='flex h-full flex-col gap-5'>
          <div
            className='h-75.5 rounded-3xl bg-cover bg-center bg-no-repeat'
            style={{ backgroundImage: `url('${heroImages[1]}')` }}
          />
          <div className='flex h-37.5 flex-row gap-5'>
            <div
              className='h-full w-full rounded-3xl bg-cover bg-center bg-no-repeat'
              style={{ backgroundImage: `url('${heroImages[2]}')` }}
            />
            <div
              className='h-full w-full rounded-3xl bg-cover bg-center bg-no-repeat'
              style={{ backgroundImage: `url('${heroImages[3]}')` }}
            />
          </div>
        </div>
      </div>

      {/* Mobile carousel */}
      <div className='md:hidden'>
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className='no-scrollbar flex w-full snap-x snap-mandatory gap-4 overflow-x-auto'
        >
          {mobileImages.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${name} ${i + 1}`}
              className='h-[260px] w-[90vw] shrink-0 snap-start rounded-3xl object-cover'
            />
          ))}
        </div>

        {mobileImages.length > 1 && (
          <div className='mt-3 flex justify-center gap-2'>
            {mobileImages.map((_, i) => (
              <span
                key={i}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  i === activeIndex ? 'bg-primary-100' : 'bg-text-muted'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
