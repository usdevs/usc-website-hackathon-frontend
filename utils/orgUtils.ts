import { UseToastOptions } from "@chakra-ui/react"

const ORGANISATION_TOAST_ID = 'organisation-toast'

export const makeSuccessOrgToast = (): UseToastOptions => {
  return {
    id: ORGANISATION_TOAST_ID,
    title: `Org created successfully!`,
    position: 'top',
    duration: 3000,
    status: 'success',
    isClosable: true,
  }
}

export const makeErrorOrgToast = (errMsg: string): UseToastOptions => {
  return {
    id: ORGANISATION_TOAST_ID,
    title: 'Oh snap! There was an error when making the org',
    description: errMsg,
    position: 'top',
    duration: 5000,
    status: 'error',
    isClosable: true,
  }
}
