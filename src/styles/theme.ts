import { createMuiTheme } from '@material-ui/core';

const defaultTheme = createMuiTheme();

export const theme = createMuiTheme({
  spacing: (value: number) => defaultTheme.typography.pxToRem(value / 0.25),
  // spacing: (value: number) => `${0.25 * value}rem`,
});
