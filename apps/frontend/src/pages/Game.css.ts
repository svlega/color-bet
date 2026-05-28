import { style } from '@vanilla-extract/css';
import { vars } from '../styles/theme.css';

export const layout = style({
  minHeight: '100vh',
  background: vars.color.bg,
  display: 'flex',
  flexDirection: 'column',
});

export const header = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: `${vars.space.md} ${vars.space.lg}`,
  background: vars.color.surface,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const logo = style({
  fontWeight: 900,
  fontSize: vars.fontSize.lg,
  color: vars.color.gold,
  letterSpacing: '0.1em',
});

export const headerRight = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.lg,
});

export const onlinePill = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  selectors: {
    '&::before': {
      content: '""',
      display: 'inline-block',
      width: '8px',
      height: '8px',
      borderRadius: vars.radius.full,
      background: vars.color.success,
    },
  },
});

export const main = style({
  flex: 1,
  display: 'grid',
  gridTemplateColumns: '1fr 380px',
  gap: vars.space.lg,
  padding: vars.space.lg,
  maxWidth: 1100,
  width: '100%',
  margin: '0 auto',
  '@media': {
    'screen and (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const leftCol = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
});

export const rightCol = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
});

export const logoutBtn = style({
  background: 'transparent',
  border: `1px solid ${vars.color.border}`,
  color: vars.color.textMuted,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  borderRadius: vars.radius.sm,
  cursor: 'pointer',
  fontSize: vars.fontSize.sm,
  selectors: {
    '&:hover': { borderColor: vars.color.error, color: vars.color.error },
  },
});

export const username = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
});

export const connecting = style({
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: vars.color.textMuted,
  background: vars.color.bg,
});
