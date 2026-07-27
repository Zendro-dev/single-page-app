import { Color as MuiColor } from '@mui/material/styles';

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

  // PaletteColorOptions itself is a type alias (SimplePaletteColorOptions |
  // ColorPartial) as of MUI v6+, not an interface - declaration merging only
  // works on the interface it resolves to, so augment that instead.
  interface SimplePaletteColorOptions {
    background?: string;
  }
}
