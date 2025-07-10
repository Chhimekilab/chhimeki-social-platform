import { colors } from '../tokens/colors';
import { typography } from '../tokens/typography';
import { shadows, spacing, borderRadius } from '../tokens/spacing';

export interface Theme {
  name: string;
  colors: any; // Allow flexible color overrides
  typography: typeof typography;
  shadows: any; // Allow flexible shadow overrides
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  isDark: boolean;
}

export const lightTheme: Theme = {
  name: 'light',
  colors: {
    ...colors,
    // Override specific colors for light theme
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
      overlay: 'rgba(0, 0, 0, 0.5)',
      glass: 'rgba(255, 255, 255, 0.8)',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      tertiary: '#64748b',
      disabled: '#cbd5e1',
      inverse: '#ffffff',
    },
  },
  typography,
  shadows,
  spacing,
  borderRadius,
  isDark: false,
};

export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    ...colors,
    // Override specific colors for dark theme
    background: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
      overlay: 'rgba(0, 0, 0, 0.8)',
      glass: 'rgba(0, 0, 0, 0.5)',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      tertiary: '#94a3b8',
      disabled: '#475569',
      inverse: '#0f172a',
    },
    // Adjust other color scales for dark mode
    primary: {
      ...colors.primary,
      50: '#172554',
      100: '#1e3a8a', 
      200: '#1e40af',
      300: '#1d4ed8',
      400: '#2563eb',
      500: '#3b82f6',
      600: '#60a5fa',
      700: '#93c5fd',
      800: '#bfdbfe',
      900: '#dbeafe',
      950: '#eff6ff',
    },
  },
  typography,
  shadows: {
    ...shadows,
    // Adjust shadows for dark theme
    base: '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)',
  },
  spacing,
  borderRadius,
  isDark: true,
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

export type ThemeName = keyof typeof themes;