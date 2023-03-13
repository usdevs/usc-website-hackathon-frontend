import React, { useState } from "react";
import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "./global.css";
import "@fontsource/domine/400.css";
import "@fontsource/do-hyeon";
import { Provider } from "react-redux";
import { wrapper } from "../redux_app/store";
import { TokenGetterProvider } from "./TokenGetterProvider";
import { Auth } from "../features/auth/Auth";
import App from "next/app";
import { TokenSetterProvider } from "./TokenSetterProvider";

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
  const [currentToken, setCurrentToken] = useState("");

  return (
    <React.StrictMode>
      {/*<Provider store={store}>*/}
      <ChakraProvider resetCSS theme={theme}>
        <TokenSetterProvider setTokenValue={setCurrentToken}>
          <TokenGetterProvider tokenValue={currentToken}>
            <Component {...pageProps} />
          </TokenGetterProvider>
        </TokenSetterProvider>
      </ChakraProvider>
      {/*</Provider>*/}
    </React.StrictMode>
  );
}


export default MyApp;
