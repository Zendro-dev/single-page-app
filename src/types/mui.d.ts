import '@mui/material/styles';

// The Zendro theme extends every palette color with a custom `background`
// shade (see src/styles/theme.ts). Augment MUI's palette types so both the
// theme input (createTheme) and reads (theme.palette.*.background) type-check.
declare module '@mui/material/styles' {
  interface PaletteColor {
    background: string;
  }
  interface SimplePaletteColorOptions {
    background?: string;
  }

  // The theme also carries a custom `color` palette of raw shade maps.
  interface Theme {
    color: Record<string, Record<number, string>>;
  }
  interface ThemeOptions {
    color?: Record<string, Record<number, string>>;
  }
}
