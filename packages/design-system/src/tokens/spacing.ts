export const spacing = {
  // Base spacing scale (based on 4px grid)
  0: '0px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
} as const;

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',

  // Colored shadows for brand elements
  'primary-sm': '0 1px 2px 0 rgb(59 130 246 / 0.15)',
  'primary-md': '0 4px 6px -1px rgb(59 130 246 / 0.15), 0 2px 4px -2px rgb(59 130 246 / 0.15)',
  'primary-lg': '0 10px 15px -3px rgb(59 130 246 / 0.15), 0 4px 6px -4px rgb(59 130 246 / 0.15)',

  // Glow effects
  glow: '0 0 0 1px rgb(59 130 246 / 0.3), 0 0 20px rgb(59 130 246 / 0.2)',
  'glow-sm': '0 0 0 1px rgb(59 130 246 / 0.2), 0 0 10px rgb(59 130 246 / 0.1)',
  'glow-lg': '0 0 0 2px rgb(59 130 246 / 0.4), 0 0 30px rgb(59 130 246 / 0.3)',

  // Social platform specific shadows
  facebook: '0 4px 6px -1px rgb(24 119 242 / 0.15), 0 2px 4px -2px rgb(24 119 242 / 0.15)',
  twitter: '0 4px 6px -1px rgb(29 161 242 / 0.15), 0 2px 4px -2px rgb(29 161 242 / 0.15)',
  linkedin: '0 4px 6px -1px rgb(0 119 181 / 0.15), 0 2px 4px -2px rgb(0 119 181 / 0.15)',
} as const;

export const borderRadius = {
  none: '0px',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

export const zIndex = {
  auto: 'auto',
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  // Modal and overlay z-indices
  backdrop: '100',
  modal: '200',
  popover: '300',
  tooltip: '400',
  toast: '500',
  // Navigation z-indices
  header: '1000',
  navigation: '1100',
  // Highest priority elements
  max: '9999',
} as const;

// Component-specific spacing presets
export const componentSpacing = {
  button: {
    padding: {
      sm: { x: spacing[3], y: spacing[1.5] },
      md: { x: spacing[4], y: spacing[2] },
      lg: { x: spacing[6], y: spacing[3] },
    },
    gap: spacing[2],
  },
  
  card: {
    padding: {
      sm: spacing[4],
      md: spacing[6],
      lg: spacing[8],
    },
    gap: spacing[4],
  },

  form: {
    gap: spacing[4],
    fieldGap: spacing[2],
    labelGap: spacing[1],
  },

  navigation: {
    padding: spacing[4],
    itemGap: spacing[2],
    height: spacing[16], // 64px
  },

  sidebar: {
    width: spacing[64], // 256px
    padding: spacing[6],
    itemGap: spacing[1],
  },

  content: {
    maxWidth: '1200px',
    padding: {
      mobile: spacing[4],
      tablet: spacing[6],
      desktop: spacing[8],
    },
  },

  grid: {
    gap: {
      sm: spacing[4],
      md: spacing[6],
      lg: spacing[8],
    },
  },
} as const;

export type Spacing = keyof typeof spacing;
export type Shadow = keyof typeof shadows;
export type BorderRadius = keyof typeof borderRadius;
export type ZIndex = keyof typeof zIndex;