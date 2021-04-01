import { AppProps } from 'next/app';
import { SnackbarProvider } from 'notistack';
import { ReactElement } from 'react';
import { Provider } from 'react-redux';

import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

import { DialogProvider } from '@/hooks/useDialog';
import { PageWithLayout } from '@/layouts';
import store from '@/store';
import { theme } from '@/styles/theme';
import '@/styles/globals.css';

interface ZendroProps extends AppProps {
  Component: PageWithLayout;
}

function Zendro({ Component, pageProps }: ZendroProps): ReactElement {
  const Layout = Component.layout ?? (({ children }) => <>{children}</>);
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
            <Layout brand="Zendro">
              <Component {...pageProps} />
            </Layout>
          </DialogProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default Zendro;
