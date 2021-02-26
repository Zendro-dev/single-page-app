import { ReactElement, useEffect } from 'react';
import { Provider } from 'react-redux';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { theme } from '../styles/theme';
import store from '../store';

import '../styles/globals.css';

function App({ Component, pageProps }: AppProps): ReactElement {
  useEffect(function removeServerSideCSS() {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) jssStyles.parentElement?.removeChild(jssStyles);
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
