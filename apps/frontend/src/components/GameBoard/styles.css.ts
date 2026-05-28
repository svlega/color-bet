import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

const reveal = keyframes({
  '0%': { transform: 'scale(0.5)', opacity: 0 },
  '60%': { transform: 'scale(1.15)' },
  '100%': { transform: 'scale(1)', opacity: 1 },
});

export const board = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 180,
  background: vars.color.surface,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  padding: vars.space.xl,
});

export const resultBadge = style({
  padding: `${vars.space.md} ${vars.space.xl}`,
  borderRadius: vars.radius.lg,
  fontSize: vars.fontSize.xxl,
  fontWeight: 900,
  letterSpacing: '0.15em',
  animationName: reveal,
  animationDuration: '0.4s',
  animationFillMode: 'both',
});

export const redResult = style({ background: vars.color.red, color: '#fff' });
export const blackResult = style({ background: vars.color.black, color: '#fff', border: `2px solid ${vars.color.border}` });

export const waitingText = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.lg,
});

export const totalBets = style({
  marginTop: vars.space.sm,
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
});
