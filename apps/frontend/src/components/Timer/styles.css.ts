import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

const pulse = keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.5 },
});

export const wrapper = style({
  textAlign: 'center',
  padding: vars.space.lg,
});

export const phase = style({
  fontSize: vars.fontSize.md,
  color: vars.color.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.15em',
  marginBottom: vars.space.sm,
});

export const countdown = style({
  fontSize: vars.fontSize.xxl,
  fontWeight: 700,
  color: vars.color.gold,
  fontVariantNumeric: 'tabular-nums',
});

export const urgent = style({
  animationName: pulse,
  animationDuration: '0.8s',
  animationIterationCount: 'infinite',
  color: vars.color.red,
});

export const phaseLabel: Record<string, string> = {
  BETTING: style({ color: vars.color.success }),
  CLOSING: style({ color: vars.color.gold }),
  RESULT: style({ color: vars.color.textMuted }),
};
