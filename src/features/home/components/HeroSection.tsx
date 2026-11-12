import { lazy, Suspense, useMemo } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { HERO_CONFIG } from '../constants/hero.constants';
import type { RecommendedItem } from '../types';
import HeroContent from './HeroContent';
import HeroVisual from './HeroVisual';
import type { HeroSlide } from './HeroVisual';

const LazyHeroCarousel = lazy(() => import('./HeroCarousel'));

interface HeroSectionProps {
  readonly slides: readonly RecommendedItem[];
}

// Renders the hero section with the main discovery call to action.
export default function HeroSection({ slides }: HeroSectionProps) {
  const heroSlides = useMemo<HeroSlide[]>(
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

  const handleExplore = () => {
    document.getElementById('restaurant-discovery')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <section
      aria-labelledby='hero-title'
      className='relative overflow-hidden bg-background'
    >
      <div
        aria-hidden='true'
        className='pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-primary-100/10 blur-3xl'
      />

      <div
        aria-hidden='true'
        className='pointer-events-none absolute -right-32 top-20 h-[420px] w-[420px] rounded-full bg-primary-100/5 blur-3xl'
      />

      <PageContainer className='relative z-10 flex min-h-[620px] items-center py-14 sm:py-16 lg:min-h-[620px] lg:py-20'>
        <div className='grid w-full items-center gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-10 xl:grid-cols-[0.9fr_1.1fr] xl:gap-16'>
          <HeroContent onExplore={handleExplore} />

          <div className='hero-enter-visual'>
            {heroSlides.length > 1 ? (
              <Suspense fallback={<HeroVisual slides={heroSlides} />}>
                <LazyHeroCarousel slides={heroSlides} />
              </Suspense>
            ) : (
              <HeroVisual slides={heroSlides} />
            )}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
