import { createGlobalTheme } from '@vanilla-extract/css';

// vanilla-extract processes this at BUILD TIME — zero runtime overhead.
// All CSS variables are injected on :root and referenced by component styles.
export const vars = createGlobalTheme(':root', {
  color: {
    bg: '#0d0d1a',
    surface: '#1a1a2e',
    surfaceHover: '#16213e',
    border: '#2d2d4e',
    red: '#e63946',
    redHover: '#ff4757',
    black: '#2d3436',
    blackHover: '#4a4a4a',
    gold: '#ffd700',
    text: '#ffffff',
    textMuted: '#8888aa',
    success: '#00b894',
    successBg: 'rgba(0,184,148,0.15)',
    error: '#e17055',
    errorBg: 'rgba(225,112,85,0.15)',
  },
  space: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '40px',
  },
  radius: {
    sm: '6px',
    md: '12px',
    lg: '20px',
    full: '9999px',
  },
  fontSize: {
    sm: '12px',
    md: '14px',
    lg: '18px',
    xl: '28px',
    xxl: '48px',
  },
});
