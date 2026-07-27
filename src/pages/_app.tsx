import { AppProps } from 'next/app';
import { SnackbarProvider } from 'notistack';
import { ReactElement } from 'react';

import { ThemeProvider } from '@mui/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

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
  pageProps: { session?: Session; key?: string };
}

function Zendro({
  Component,
  pageProps: { session, key, ...pageProps },
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
      {/* @mui/styles (JSS, still used throughout this app's own components
          via makeStyles) needs to inject its stylesheets before MUI's own
          (emotion-based since v5) for a custom class to win a tie in
          specificity by source order the way it did under MUI v4, when both
          used JSS - without this, MUI's own component defaults (e.g.
          ListItemButton's built-in flex/padding) silently win over custom
          overrides instead. */}
      <StyledEngineProvider injectFirst>
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
                withLayout(<Component key={key} {...pageProps} />)
              ) : Layout ? (
                <Layout brand="Zendro">
                  <Component key={key} {...pageProps} />
                </Layout>
              ) : (
                <Component key={key} {...pageProps} />
              )}
            </DialogProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </SessionProvider>
  );
}

export default Zendro;
