import React from "react";
import App from "next/app";
import Head from "next/head";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <Head>
          <title>dbrain</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <link rel="stylesheet" href="/static/index.css"></link>
        </Head>
        <Component {...pageProps} />
      </>
    );
  }
}

export default MyApp;
