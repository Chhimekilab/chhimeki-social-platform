export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Main brand color
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },

  // Secondary Colors
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },

  // Success Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },

  // Warning Colors
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },

  // Error Colors
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },

  // Neutral Colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },

  // Social Media Platform Colors
  social: {
    facebook: '#1877f2',
    twitter: '#1da1f2',
    linkedin: '#0077b5',
    instagram: '#e4405f',
    youtube: '#ff0000',
    github: '#181717',
    google: '#4285f4',
  },

  // Semantic Colors for Features
  neighborhood: {
    safety: '#ef4444',      // Red for safety alerts
    marketplace: '#10b981', // Green for marketplace
    community: '#8b5cf6',   // Purple for community
    business: '#f59e0b',    // Amber for business
  },

  professional: {
    jobs: '#2563eb',        // Blue for jobs
    network: '#059669',     // Emerald for networking
    skills: '#7c3aed',      // Violet for skills
    companies: '#dc2626',   // Red for companies
  },

  // Background Colors
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    overlay: 'rgba(0, 0, 0, 0.5)',
    glass: 'rgba(255, 255, 255, 0.1)',
  },

  // Text Colors
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    tertiary: '#64748b',
    disabled: '#cbd5e1',
    inverse: '#ffffff',
  },

  // Border Colors
  border: {
    light: '#e2e8f0',
    medium: '#cbd5e1',
    dark: '#94a3b8',
  },
} as const;

export type ColorScale = keyof typeof colors;
export type ColorShade = keyof typeof colors.primary;

// Helper function to get color values
export const getColor = (scale: ColorScale, shade?: ColorShade | number) => {
  const colorScale = colors[scale];
  if (typeof colorScale === 'string') {
    return colorScale;
  }
  if (shade && typeof shade === 'number') {
    return (colorScale as Record<number, string>)[shade];
  }
  if (shade && typeof shade === 'string') {
    return (colorScale as Record<string, string>)[shade];
  }
  return colorScale[500] || colorScale;
};