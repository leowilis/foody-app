import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

import { HERO_CONFIG, HERO_CONTENT } from '../constants/hero.constants';

interface HeroContentProps {
  onExplore: () => void;
}

export default function HeroContent({ onExplore }: HeroContentProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 24,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: HERO_CONFIG.animation.duration,
        ease: HERO_CONFIG.animation.ease,
      }}
      className='relative z-10 flex max-w-2xl flex-col items-start'
    >
      <div className='mb-6 inline-flex items-center gap-2 rounded-full border border-primary-100/10 bg-primary-100/5 px-4 py-2'>
        <span className='flex h-6 w-6 items-center justify-center rounded-full bg-primary-100/10'>
          <Sparkles
            aria-hidden='true'
            className='h-3.5 w-3.5 text-primary-100'
          />
        </span>

        <span className='text-[11px] font-extrabold uppercase tracking-[0.24em] text-primary-100'>
          {HERO_CONTENT.eyebrow}
        </span>
      </div>

      <h1
        id='hero-title'
        className='max-w-2xl text-[3.25rem] font-black leading-[0.96] tracking-[-0.055em] text-neutral-950 sm:text-6xl md:text-7xl lg:text-[4.7rem] xl:text-[5.25rem]'
      >
        Your next
        <br />
        favorite meal
        <br />
        <span className='text-primary-100'>is waiting.</span>
      </h1>

      <p className='mt-7 max-w-lg text-base leading-7 text-neutral-500 sm:text-lg sm:leading-8'>
        {HERO_CONTENT.description}
      </p>

      <button
        type='button'
        onClick={onExplore}
        className='group mt-9 inline-flex h-14 items-center gap-5 rounded-full bg-neutral-950 px-7 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(0,0,0,0.14)] outline-none transition-all duration-200 hover:-translate-y-1 hover:bg-neutral-800 hover:shadow-[0_16px_35px_rgba(0,0,0,0.18)] focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:ring-offset-4'
      >
        <span>{HERO_CONTENT.cta}</span>

        <span className='flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-transform duration-200 group-hover:translate-x-1'>
          <ArrowRight aria-hidden='true' className='h-4 w-4' />
        </span>
      </button>
    </motion.div>
  );
}
