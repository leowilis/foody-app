export const HERO_CONFIG = {
  autoplayDelay: 5000,

  desktop: {
    minHeight: 560,
    imageHeight: 500,
  },

  mobile: {
    minHeight: 620,
    imageHeight: 300,
  },

  animation: {
    duration: 0.7,
    stagger: 0.08,
    ease: [0.22, 1, 0.36, 1] as const,
  },
} as const;

export const HERO_CONTENT = {
  eyebrow: 'DISCOVER GOOD FOOD',
  title: 'Your next favorite meal is waiting.',
  description:
    'Find great restaurants, discover delicious food, and enjoy every bite.',
  cta: 'Explore restaurants',
} as const;
