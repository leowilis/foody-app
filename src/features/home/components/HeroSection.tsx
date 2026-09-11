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
    const target = document.getElementById('restaurant-discovery');

    target?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <section
      aria-labelledby='hero-title'
      className='relative overflow-hidden bg-white'
    >
      <PageContainer className='flex min-h-[620px] items-center py-10 sm:py-14 lg:min-h-[560px] lg:py-16'>
        <div className='grid w-full items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14'>
          <HeroContent onExplore={handleExplore} />

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: HERO_CONFIG.animation.duration,
              delay: HERO_CONFIG.animation.stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <HeroVisual slides={slides} />
          </motion.div>
        </div>
      </PageContainer>

      {/* Decorative background element */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute -right-40 top-20 -z-0 h-80 w-80 rounded-full bg-primary-100/5 blur-3xl'
      />
    </section>
  );
}
