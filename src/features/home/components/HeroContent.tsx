import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { HERO_CONFIG, HERO_CONTENT } from '../constants/hero.constants';

interface HeroContentProps {
  onExplore: () => void;
}

export default function HeroContent({ onExplore }: HeroContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: HERO_CONFIG.animation.duration,
        ease: HERO_CONFIG.animation.ease,
      }}
      className='relative z-10 flex max-w-xl flex-col items-start'
    >
      <span className='mb-5 text-xs font-extrabold uppercase tracking-[0.2em] text-primary-100'>
        {HERO_CONTENT.eyebrow}
      </span>

      <h1 className='max-w-2xl text-4xl font-black leading-[1.02] tracking-[-0.045em] text-neutral-950 sm:text-5xl md:text-6xl lg:text-7xl'>
        Your next
        <br />
        favorite meal
        <br />
        <span className='text-primary-100'>is waiting.</span>
      </h1>

      <p className='mt-6 max-w-lg text-base leading-7 text-neutral-500 sm:text-lg'>
        {HERO_CONTENT.description}
      </p>

      <button
        type='button'
        onClick={onExplore}
        className='mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-neutral-950 px-6 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:ring-offset-2'
      >
        {HERO_CONTENT.cta}

        <ArrowRight aria-hidden='true' className='h-4 w-4' />
      </button>
    </motion.div>
  );
}
