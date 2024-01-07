import React from 'react'
import type { AppProps } from 'next/app'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import './global.css'
import '@fontsource/domine/400.css'
import '@fontsource/do-hyeon'
import NavMenu from '../components/NavMenu'
import Footer from '../components/Footer'

const colors = {
  brand: {
    primary: '#1F407B',
    secondary: '#386DCD',
    warning: '#EC3232',
    success: {
      light: '#66CC99',
      dark: '#379767',
    },
  },
}

const fonts = {
  heading: `'Domine', serif`,
  body: `'Domine', serif`,
  // body: `'Do Hyeon', sans-serif`,
}

const components = {
  Button: {
    baseStyle: {
      rounded: 'none',
      fontWeight: 'normal',
    },
    variants: {
      primary: {
        backgroundColor: 'brand.primary',
        _hover: {
          backgroundColor: 'brand.secondary',
        },
        color: 'white',
      },
      success: {
        backgroundColor: 'brand.success.light',
        _hover: {
          backgroundColor: 'brand.success.dark',
        },
        color: 'black',
      },
      warning: {
        backgroundColor: 'brand.warning',
        color: 'white',
      },
      secondary: {
        backgroundColor: 'gray.200',
        _hover: {
          backgroundColor: 'gray.300',
        },
        color: 'black',
      },
      link: {
        color: 'black',
      },
    },
    defaultProps: {
      variant: 'primary',
    },
  },
  FormLabel: {
    baseStyle: {
      fontSize: 'small',
      color: 'gray.500',
    },
  },
}

const theme = extendTheme({ colors, fonts, components })

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.StrictMode>
      <ChakraProvider resetCSS theme={theme}>
        <NavMenu />
        <Component {...pageProps} />
        <Footer />
      </ChakraProvider>
    </React.StrictMode>
  )
}

export default MyApp
