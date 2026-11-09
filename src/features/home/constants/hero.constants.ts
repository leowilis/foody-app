export const HERO_CONFIG = {
  autoplayDelay: 5000,

  animation: {
    duration: 0.7,
    delay: 0.08,
    initialY: 24,
    initialX: 20,
    initialScale: 0.96,
    ease: [0.22, 1, 0.36, 1] as const,
  },

  visual: {
    maxSlides: 5,
  },
} as const;

export const HERO_CONTENT = {
  eyebrow: 'DISCOVER GOOD FOOD',
  description:
    'Find great restaurants, discover delicious food, and enjoy every bite.',
  cta: 'Explore restaurants',
} as const;
