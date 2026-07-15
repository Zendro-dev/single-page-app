// theme.ts (copied verbatim from single-page-app/src/styles/theme.ts) sets a
// `background` field on several palette colors - not part of MUI's stock
// PaletteColor type. The original app apparently never typechecked this
// (Next's dev server transpiles via SWC without blocking on tsc errors);
// this augmentation is MUI's own documented pattern for extending the
// palette shape (https://mui.com/material-ui/customization/palette/#custom-colors),
// making the existing theme.ts type-check for real rather than papering over it.
import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface PaletteColor {
    background?: string;
  }
  interface SimplePaletteColorOptions {
    background?: string;
  }

  // theme.ts also sets a top-level `color: { blue, red, yellow }` (the raw
  // MUI-shade scales, kept around alongside their use in `palette` above) -
  // same story, same fix.
  interface Theme {
    color?: Record<string, Record<string, string>>;
  }
  interface ThemeOptions {
    color?: Record<string, Record<string, string>>;
  }
}
