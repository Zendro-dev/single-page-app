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
import { Session } from 'next-auth';

import { BASEPATH } from '@/config/globals';
interface ZendroProps extends AppProps {
  Component: PageWithLayout;
  pageProps: { session?: Session };
}

function Zendro({
  Component,
  pageProps: { session, ...pageProps },
}: ZendroProps): ReactElement {
  const Layout = Component.layout;
  const withLayout = Component.withLayout;
  return (
    <SessionProvider
      session={session}
      // refetch every 4min 59sec to avoid the session expiring. This interval
      // has to be smaller than the time difference for a token to count as
      // "expired" (default 5 min). See [...nextauth].ts
      refetchInterval={4 * 60 - 1}
      refetchOnWindowFocus={true}
      basePath={BASEPATH ? `${BASEPATH}/api/auth` : undefined}
    >
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
