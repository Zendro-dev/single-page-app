import { createMuiTheme } from '@material-ui/core/styles';

const defaultTheme = createMuiTheme();

const blue = {
  50: '#f0f4f8',
  100: '#d9e2ec',
  200: '#bcccdc',
  300: '#9fb3c8',
  400: '#829ab1',
  500: '#627d98',
  600: '#486581',
  700: '#334e68',
  800: '#243b53',
  900: '#102a43',
};

const red = {
  50: '#ffe3e3',
  100: '#ffdbdb',
  200: '#ff9b9b',
  300: '#f86a6a',
  400: '#ef4e4e',
  500: '#e12d39',
  600: '#cf1124',
  700: '#ab091e',
  800: '#8a041a',
  900: '#610316',
};

export const theme = createMuiTheme({
  spacing: (value: number) => defaultTheme.typography.pxToRem(value / 0.25),
  // spacing: (value: number) => `${0.25 * value}rem`,
  palette: {
    primary: {
      light: blue[100],
      main: blue[600],
      dark: blue[700],
    },
    secondary: {
      light: red[200],
      main: red[600],
      dark: red[700],
    },
  },
  color: {
    blue,
    red,
  },
});
