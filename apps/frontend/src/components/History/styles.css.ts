import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const container = style({
  background: vars.color.surface,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  overflow: 'hidden',
});

export const header = style({
  padding: `${vars.space.sm} ${vars.space.md}`,
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  borderBottom: `1px solid ${vars.color.border}`,
});

export const row = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
  padding: `${vars.space.sm} ${vars.space.md}`,
  fontSize: vars.fontSize.sm,
  borderBottom: `1px solid ${vars.color.border}`,
  ':last-child': { borderBottom: 'none' },
});

export const winRow = style({ background: vars.color.successBg });
export const lossRow = style({ background: vars.color.errorBg });

export const badge = style({
  display: 'inline-block',
  padding: `2px ${vars.space.xs}`,
  borderRadius: vars.radius.sm,
  fontSize: vars.fontSize.sm,
  fontWeight: 600,
  letterSpacing: '0.05em',
});

export const redBadge = style({ background: vars.color.red, color: '#fff' });
export const blackBadge = style({ background: vars.color.black, color: '#fff' });
export const winText = style({ color: vars.color.success, fontWeight: 600 });
export const lossText = style({ color: vars.color.error });

export const empty = style({
  padding: vars.space.lg,
  textAlign: 'center',
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
});
