import { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { theme } from '../styles/theme';
import store from '../store';
import { DialogProvider } from '@/components/dialog/dialog-provider';

import '@/styles/globals.css';

function App({ Component, pageProps }: AppProps): ReactElement {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <DialogProvider>
            <Component {...pageProps} />
          </DialogProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
