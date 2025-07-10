export const typography = {
  // Font Families
  fontFamily: {
    sans: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Fira Sans',
      'Droid Sans',
      'Helvetica Neue',
      'sans-serif',
    ],
    serif: [
      'ui-serif',
      'Georgia',
      'Cambria',
      'Times New Roman',
      'Times',
      'serif',
    ],
    mono: [
      'ui-monospace',
      'SFMono-Regular',
      'Menlo',
      'Monaco',
      'Consolas',
      'Liberation Mono',
      'Courier New',
      'monospace',
    ],
  },

  // Font Sizes (with corresponding line heights)
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
    '5xl': ['3rem', { lineHeight: '1' }],         // 48px
    '6xl': ['3.75rem', { lineHeight: '1' }],      // 60px
    '7xl': ['4.5rem', { lineHeight: '1' }],       // 72px
    '8xl': ['6rem', { lineHeight: '1' }],         // 96px
    '9xl': ['8rem', { lineHeight: '1' }],         // 128px
  },

  // Font Weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  // Line Heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Text Presets for common use cases
  textStyles: {
    // Display styles
    'display-2xl': {
      fontSize: '4.5rem',
      lineHeight: '1',
      fontWeight: '800',
      letterSpacing: '-0.025em',
    },
    'display-xl': {
      fontSize: '3.75rem',
      lineHeight: '1',
      fontWeight: '800',
      letterSpacing: '-0.025em',
    },
    'display-lg': {
      fontSize: '3rem',
      lineHeight: '1',
      fontWeight: '800',
      letterSpacing: '-0.025em',
    },
    'display-md': {
      fontSize: '2.25rem',
      lineHeight: '2.5rem',
      fontWeight: '700',
      letterSpacing: '-0.025em',
    },
    'display-sm': {
      fontSize: '1.875rem',
      lineHeight: '2.25rem',
      fontWeight: '600',
    },
    'display-xs': {
      fontSize: '1.5rem',
      lineHeight: '2rem',
      fontWeight: '600',
    },

    // Heading styles
    'heading-xl': {
      fontSize: '1.25rem',
      lineHeight: '1.75rem',
      fontWeight: '600',
    },
    'heading-lg': {
      fontSize: '1.125rem',
      lineHeight: '1.75rem',
      fontWeight: '600',
    },
    'heading-md': {
      fontSize: '1rem',
      lineHeight: '1.5rem',
      fontWeight: '600',
    },
    'heading-sm': {
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      fontWeight: '600',
    },
    'heading-xs': {
      fontSize: '0.75rem',
      lineHeight: '1rem',
      fontWeight: '600',
    },

    // Body text styles
    'body-xl': {
      fontSize: '1.25rem',
      lineHeight: '1.75rem',
      fontWeight: '400',
    },
    'body-lg': {
      fontSize: '1.125rem',
      lineHeight: '1.75rem',
      fontWeight: '400',
    },
    'body-md': {
      fontSize: '1rem',
      lineHeight: '1.5rem',
      fontWeight: '400',
    },
    'body-sm': {
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      fontWeight: '400',
    },
    'body-xs': {
      fontSize: '0.75rem',
      lineHeight: '1rem',
      fontWeight: '400',
    },

    // Caption styles
    'caption-lg': {
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      fontWeight: '500',
    },
    'caption-md': {
      fontSize: '0.75rem',
      lineHeight: '1rem',
      fontWeight: '500',
    },
    'caption-sm': {
      fontSize: '0.75rem',
      lineHeight: '1rem',
      fontWeight: '400',
    },

    // Button text styles
    'button-lg': {
      fontSize: '1rem',
      lineHeight: '1.5rem',
      fontWeight: '600',
    },
    'button-md': {
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      fontWeight: '600',
    },
    'button-sm': {
      fontSize: '0.75rem',
      lineHeight: '1rem',
      fontWeight: '600',
    },

    // Overline styles
    overline: {
      fontSize: '0.75rem',
      lineHeight: '1rem',
      fontWeight: '600',
      letterSpacing: '0.05em',
      textTransform: 'uppercase' as const,
    },
  },
} as const;

export type FontFamily = keyof typeof typography.fontFamily;
export type FontSize = keyof typeof typography.fontSize;
export type FontWeight = keyof typeof typography.fontWeight;
export type TextStyle = keyof typeof typography.textStyles;