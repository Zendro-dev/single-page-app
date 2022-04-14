import { AppProps } from 'next/app';
import { SnackbarProvider } from 'notistack';
import { ReactElement } from 'react';

import { ThemeProvider } from '@mui/styles';
import { CssBaseline } from '@mui/material';

import { DialogProvider } from '@/components/dialog-popup';
import { PageWithLayout } from '@/layouts';
import { theme } from '@/styles/theme';
import '@/styles/globals.css';
import '@/i18n';

import { SessionProvider } from 'next-auth/react';
interface ZendroProps extends AppProps {
  Component: PageWithLayout;
}

function Zendro({
  Component,
  pageProps: { session, ...pageProps },
}: ZendroProps): ReactElement {
  const Layout = Component.layout;
  const withLayout = Component.withLayout;
  return (
    <SessionProvider session={session} refetchInterval={9.5 * 60}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <DialogProvider>
            {withLayout ? (
              withLayout(<Component {...pageProps} />)
            ) : Layout ? (
              <Layout brand="Zendro">
                <Component {...pageProps} />
              </Layout>
            ) : (
              <Component {...pageProps} />
            )}
          </DialogProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

export default Zendro;
