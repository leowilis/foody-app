import { ArrowRight, Sparkles } from 'lucide-react';
import { HERO_CONTENT } from '../constants/hero.constants';

interface HeroContentProps {
  onExplore: () => void;
}

// Renders the hero copy and primary discovery action.
export default function HeroContent({ onExplore }: HeroContentProps) {
  return (
    <div className='hero-enter-content relative z-10 flex max-w-2xl flex-col items-start'>
      <div className='mb-6 inline-flex items-center gap-2 rounded-pill border border-primary-100/10 bg-primary-100/5 px-4 py-2'>
        <span className='flex h-6 w-6 items-center justify-center rounded-pill bg-primary-100/10'>
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
        className='max-w-2xl text-[3.25rem] font-black leading-[0.96] tracking-[-0.055em] text-text sm:text-6xl md:text-7xl lg:text-[4.7rem] xl:text-[5.25rem]'
      >
        Your next
        <br />
        favorite meal
        <br />
        <span className='text-primary-100'>is waiting.</span>
      </h1>

      <p className='mt-7 max-w-lg text-base leading-7 text-text-secondary sm:text-lg sm:leading-8'>
        {HERO_CONTENT.description}
      </p>

      <button
        type='button'
        onClick={onExplore}
        className='group mt-9 inline-flex h-14 items-center gap-5 rounded-pill bg-primary-100 px-7 text-sm font-extrabold text-primary-foreground shadow-foody-md outline-none transition-all duration-200 hover:-translate-y-1 hover:bg-primary-200 hover:shadow-foody-lg focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:ring-offset-4 focus-visible:ring-offset-background'
      >
        <span>{HERO_CONTENT.cta}</span>

        <span className='flex h-8 w-8 items-center justify-center rounded-pill bg-primary-foreground/10 transition-transform duration-200 group-hover:translate-x-1'>
          <ArrowRight aria-hidden='true' className='h-4 w-4' />
        </span>
      </button>
    </div>
  );
}
