export const DESIGN = {
  layout: {
    maxWidth: '1280px',

    padding: {
      mobile: '20px',
      tablet: '32px',
      desktop: '40px',
    },
  },

  header: {
    height: {
      mobile: 64,
      desktop: 80,
    },
  },

  section: {
    padding: {
      mobile: 64,
      desktop: 96,
    },

    gap: {
      mobile: 48,
      desktop: 72,
    },
  },

  radius: {
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    pill: 999,
  },

  shadow: {
    card: '0 8px 30px rgba(0, 0, 0, 0.06)',
    floating: '0 12px 40px rgba(0, 0, 0, 0.08)',
  },
} as const;