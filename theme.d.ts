import { Color as MuiColor } from '@material-ui/core';
import {
  Theme as MuiTheme,
  ThemeOptions as MuiThemeOptions,
} from '@material-ui/core/styles';

type Colors = Record<
  'blue' | 'red',
  Omit<MuiColor, 'A100' | 'A200' | 'A400' | 'A700'>
>;

declare module '@material-ui/core/styles' {
  interface Theme extends MuiTheme {
    color: Colors;
  }

  // allow configuration using `createMuiTheme`
  interface ThemeOptions extends MuiThemeOptions {
    color?: Partial<Colors>;
  }
}
