import { createTheme } from '@mui/material/styles';

const defaultTheme = createTheme();

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

const yellow = {
  50: '#fffbea',
  100: '#fff3c4',
  200: '#fce588',
  300: '#fadb5f',
  400: '#f7c948',
  500: '#f0b429',
  600: '#de911d',
  700: '#cb6e17',
  800: '#b44d12',
  900: '#8d2b0b',
};

const green = {
  50: '#effcf6',
  100: '#c6f7e2',
  200: '#8eedc7',
  300: '#65d6ad',
  400: '#3ebd94',
  500: '#27ab83',
  600: '#199473',
  700: '#147d64',
  800: '#0c6b58',
  900: '#014d40',
};

export const theme = createTheme({
  spacing: (value: number) => defaultTheme.typography.pxToRem(value / 0.25),
  // spacing: (value: number) => `${0.25 * value}rem`,
  palette: {
    error: {
      background: red[50],
      light: red[200],
      main: red[600],
      dark: red[700],
    },
    primary: {
      background: blue[50],
      light: blue[100],
      main: blue[600],
      dark: blue[700],
    },
    secondary: {
      background: red[50],
      light: red[200],
      main: red[600],
      dark: red[700],
    },
    success: {
      background: green[50],
      light: green[100],
      main: green[600],
      dark: green[700],
    },
    warning: {
      background: yellow[50],
      light: yellow[100],
      main: yellow[600],
      dark: yellow[700],
    },
  },
  color: {
    blue,
    red,
    yellow,
  },
});
