import createEmotionServer from "@emotion/server/create-instance";
import { ServerStyleSheets } from "@material-ui/core/styles";
import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";

import cache from "../src/cache";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="manifest" href="/manifest.webmanifest" />

          <link
            rel="icon shortcut"
            href="/icons/favicon.ico"
            type="image/x-icon"
          />

          <link
            rel="stylesheet"
            href="//fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <link
            rel="stylesheet"
            href="//fonts.googleapis.com/icon?family=Material+Icons"
          />

          <meta
            name="viewport"
            content="initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no"
          />

          <title>MyProfileThemes</title>
        </Head>

        <body>
          <noscript>ENABLE JAVASCRIPT TO VIEW THIS</noscript>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  // server
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render

  // server with error
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render

  // client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const originalRenderPage = ctx.renderPage;
  const sheets = new ServerStyleSheets();

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);
  const { extractCritical } = createEmotionServer(cache);
  const styles = extractCritical(initialProps.html);

  return {
    ...initialProps,
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement(),
      <style
        key="emotion-style-tag"
        data-emotion-css={styles.ids.join(" ")}
        dangerouslySetInnerHTML={{ __html: styles.css }} // eslint-disable-next-line react/no-danger
      />,
    ],
  };
};
