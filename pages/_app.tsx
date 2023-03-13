import React from "react";
import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "./global.css";
import "@fontsource/domine/400.css";
import "@fontsource/do-hyeon";
import { Provider } from "react-redux";
import { store } from '../app/store';

const colors = {
  brand: {
    900: "#229ed9",
    800: "#229ed9",
    700: "#229ed9"
  }
};

const fonts = {
  heading: `'Domine', serif`,
  body: `'Domine', serif`
  // body: `'Do Hyeon', sans-serif`,
};

const theme = extendTheme({ colors, fonts });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <ChakraProvider resetCSS theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </Provider>
    </React.StrictMode>

  );
}

export default MyApp;
