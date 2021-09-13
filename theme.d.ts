import { Color as MuiColor } from '@mui/material';

type Colors = Record<
  'blue' | 'red' | 'yellow',
  Omit<MuiColor, 'A100' | 'A200' | 'A400' | 'A700'>
>;

declare module '@mui/material/styles' {
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
