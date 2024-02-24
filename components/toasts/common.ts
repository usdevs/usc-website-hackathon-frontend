import { UseToastOptions } from '@chakra-ui/react'

export const notLoggedInToast = {
  title: 'Error',
  description: 'You must be logged in to perform that action.',
  status: 'error',
  duration: 5000,
  isClosable: true,
} satisfies UseToastOptions
