import React, { ReactElement } from 'react';
import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';
import { ServerStyleSheets } from '@mui/styles';
import { theme } from '../styles/theme';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<{
    styles: (
      | string
      | number
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
      | React.ReactFragment
    )[];
    html: string;
    head?: (JSX.Element | null)[] | undefined;
  }> {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
      });

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: [
        ...React.Children.toArray(initialProps.styles),
        sheets.getStyleElement(),
      ],
    };
  }

  render(): ReactElement {
    return (
      <Html lang="en">
        <Head>
          {/* PWA primary color */}
          <meta name="theme-color" content={theme.palette.primary.main} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
