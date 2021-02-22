import { createMuiTheme } from '@material-ui/core';

export const theme = createMuiTheme({
  spacing: (factor: number) => `${0.25 * factor}rem`,
});
