import { style } from '@vanilla-extract/css';
import { vars } from '../styles/theme.css';

export const page = style({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: vars.color.bg,
});

export const card = style({
  width: '100%',
  maxWidth: 400,
  background: vars.color.surface,
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  padding: vars.space.xl,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
});

export const title = style({
  fontSize: vars.fontSize.xl,
  fontWeight: 900,
  textAlign: 'center',
  color: vars.color.gold,
  letterSpacing: '0.1em',
});

export const subtitle = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
  textAlign: 'center',
});

export const inputStyle = style({
  width: '100%',
  padding: `${vars.space.sm} ${vars.space.md}`,
  background: vars.color.bg,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  color: vars.color.text,
  fontSize: vars.fontSize.md,
  selectors: {
    '&:focus': { outline: `2px solid ${vars.color.gold}`, borderColor: 'transparent' },
  },
});

export const btn = style({
  width: '100%',
  padding: vars.space.md,
  borderRadius: vars.radius.sm,
  border: 'none',
  fontSize: vars.fontSize.md,
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'opacity 0.15s',
  selectors: {
    '&:hover:not(:disabled)': { opacity: 0.85 },
    '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
  },
});

export const primaryBtn = style({
  background: vars.color.gold,
  color: vars.color.bg,
});

export const secondaryBtn = style({
  background: vars.color.surface,
  color: vars.color.textMuted,
  border: `1px solid ${vars.color.border}`,
});

export const errorBox = style({
  color: vars.color.error,
  background: vars.color.errorBg,
  padding: vars.space.sm,
  borderRadius: vars.radius.sm,
  fontSize: vars.fontSize.sm,
  textAlign: 'center',
});
