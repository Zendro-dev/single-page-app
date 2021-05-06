import { Color as MuiColor } from '@material-ui/core';

type Colors = Record<
  'blue' | 'red' | 'yellow',
  Omit<MuiColor, 'A100' | 'A200' | 'A400' | 'A700'>
>;

declare module '@material-ui/core/styles' {
  interface Theme {
    color: Colors;
  }

  interface ThemeOptions {
    color?: Partial<Colors>;
  }

  interface PaletteColor {
    background: string;
    light: string;
    main: string;
    dark: string;
    contrastText: string;
  }

  interface PaletteColorOptions {
    background?: string;
    light?: string;
    main: string;
    dark?: string;
    contrastText?: string;
  }
}
