import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  padding: vars.space.lg,
  background: vars.color.surface,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
});

export const colorButtons = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: vars.space.md,
});

export const colorBtn = style({
  padding: `${vars.space.lg} ${vars.space.md}`,
  borderRadius: vars.radius.md,
  border: '2px solid transparent',
  fontSize: vars.fontSize.lg,
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  letterSpacing: '0.1em',
  selectors: {
    '&:disabled': { opacity: 0.4, cursor: 'not-allowed' },
  },
});

export const redBtn = style({
  background: vars.color.red,
  color: '#fff',
  selectors: {
    '&:hover:not(:disabled)': { background: vars.color.redHover, transform: 'translateY(-2px)' },
  },
});

export const blackBtn = style({
  background: vars.color.black,
  color: '#fff',
  selectors: {
    '&:hover:not(:disabled)': { background: vars.color.blackHover, transform: 'translateY(-2px)' },
  },
});

export const selected = style({
  outline: `3px solid ${vars.color.gold}`,
  outlineOffset: '2px',
});

export const amountRow = style({
  display: 'flex',
  gap: vars.space.sm,
});

export const input = style({
  flex: 1,
  padding: `${vars.space.sm} ${vars.space.md}`,
  background: vars.color.bg,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  color: vars.color.text,
  fontSize: vars.fontSize.lg,
  fontVariantNumeric: 'tabular-nums',
  selectors: {
    '&:focus': { outline: `2px solid ${vars.color.gold}`, borderColor: 'transparent' },
  },
});

export const submitBtn = style({
  padding: `${vars.space.sm} ${vars.space.lg}`,
  background: vars.color.gold,
  color: vars.color.bg,
  border: 'none',
  borderRadius: vars.radius.sm,
  fontSize: vars.fontSize.md,
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'opacity 0.15s',
  selectors: {
    '&:hover:not(:disabled)': { opacity: 0.85 },
    '&:disabled': { opacity: 0.4, cursor: 'not-allowed' },
  },
});

export const message = style({
  fontSize: vars.fontSize.md,
  textAlign: 'center',
  padding: vars.space.sm,
  borderRadius: vars.radius.sm,
});

export const successMsg = style({
  background: vars.color.successBg,
  color: vars.color.success,
});

export const errorMsg = style({
  background: vars.color.errorBg,
  color: vars.color.error,
});

export const quickAmounts = style({
  display: 'flex',
  gap: vars.space.sm,
});

export const quickBtn = style({
  flex: 1,
  padding: vars.space.sm,
  background: vars.color.bg,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
  cursor: 'pointer',
  selectors: {
    '&:hover': { borderColor: vars.color.gold, color: vars.color.gold },
  },
});
