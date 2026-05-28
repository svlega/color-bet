import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

const flash = keyframes({
  '0%': { transform: 'scale(1)' },
  '50%': { transform: 'scale(1.08)' },
  '100%': { transform: 'scale(1)' },
});

export const container = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
});

export const label = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
});

export const balance = style({
  fontSize: vars.fontSize.lg,
  fontWeight: 700,
  color: vars.color.gold,
  fontVariantNumeric: 'tabular-nums',
});

export const animating = style({
  animationName: flash,
  animationDuration: '0.3s',
});

export const delta = style({
  fontSize: vars.fontSize.sm,
  fontWeight: 600,
  padding: `2px ${vars.space.xs}`,
  borderRadius: vars.radius.sm,
});

export const win = style({ color: vars.color.success, background: vars.color.successBg });
export const loss = style({ color: vars.color.error, background: vars.color.errorBg });
