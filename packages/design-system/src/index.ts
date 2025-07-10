// Design Tokens
export * from './tokens/colors';
export * from './tokens/typography';
export * from './tokens/spacing';

// Theme exports
export { lightTheme, darkTheme, themes } from './themes';

// Component exports (to be created)
// export * from './components/Button';
// export * from './components/Card';
// export * from './components/Input';
// export * from './components/Modal';

// Utility functions
export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Theme provider hook
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ThemeState {
  theme: 'light' | 'dark' | 'system';
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      effectiveTheme: 'light',
      setTheme: (theme) => {
        const effectiveTheme = theme === 'system' 
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : theme;
        
        set({ theme, effectiveTheme });
        
        // Update document class for CSS
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(effectiveTheme);
        }
      },
    }),
    {
      name: 'chhimeki-theme',
    }
  )
);

// Responsive breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Animation presets
export const animations = {
  transition: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
  spring: {
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    snappy: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
} as const;

// Platform-specific utilities
export const platformUtils = {
  isWeb: typeof window !== 'undefined',
  isMobile: typeof navigator !== 'undefined' && /Mobile|Android|iPhone|iPad/.test(navigator.userAgent),
  isIOS: typeof navigator !== 'undefined' && /iPhone|iPad/.test(navigator.userAgent),
  isAndroid: typeof navigator !== 'undefined' && /Android/.test(navigator.userAgent),
};

// Design system version
export const version = '1.0.0';