import { UseToastOptions } from '@chakra-ui/react'

const ORGANISATION_TOAST_ID = 'organisation-toast'

export const makeSuccessOrgToast = (title: string): UseToastOptions => {
  return {
    id: ORGANISATION_TOAST_ID,
    title: title,
    position: 'top',
    duration: 3000,
    status: 'success',
    isClosable: true,
  }
}

export const makeErrorOrgToast = (title: string, errMsg: string): UseToastOptions => {
  return {
    id: ORGANISATION_TOAST_ID,
    title: title,
    description: errMsg,
    position: 'top',
    duration: 5000,
    status: 'error',
    isClosable: true,
  }
}
