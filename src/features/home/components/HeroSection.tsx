import { motion } from 'framer-motion';
import PageContainer from '@/components/layout/PageContainer';
import { HERO_CONFIG } from '../constants/hero.constants';
import type { RecommendedItem } from '../types';
import HeroContent from './HeroContent';
import HeroVisual from './HeroVisual';

interface HeroSectionProps {
  slides: RecommendedItem[];
}

export default function HeroSection({ slides }: HeroSectionProps) {
  const handleExplore = () => {
    document.getElementById('restaurant-discovery')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <section
      aria-labelledby='hero-title'
      className='relative overflow-hidden bg-[#fffaf6]'
    >
      {/* Decorative background shapes */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-primary-100/10 blur-3xl'
      />

      <div
        aria-hidden='true'
        className='pointer-events-none absolute -right-32 top-20 h-[420px] w-[420px] rounded-full bg-orange-100/40 blur-3xl'
      />

      <PageContainer className='relative z-10 flex min-h-[620px] items-center py-14 sm:py-16 lg:min-h-[620px] lg:py-20'>
        <div className='grid w-full items-center gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-10 xl:grid-cols-[0.9fr_1.1fr] xl:gap-16'>
          <HeroContent onExplore={handleExplore} />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
              x: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
            }}
            transition={{
              duration: HERO_CONFIG.animation.duration,
              delay: HERO_CONFIG.animation.stagger,
              ease: HERO_CONFIG.animation.ease,
            }}
          >
            <HeroVisual slides={slides} />
          </motion.div>
        </div>
      </PageContainer>
    </section>
  );
}
