import { UseToastOptions } from '@chakra-ui/react'

const ORGANISATION_TOAST_ID = 'admin-toast'

export const makeSuccessToast = (title: string): UseToastOptions => {
  return {
    id: ORGANISATION_TOAST_ID,
    title: title,
    position: 'top',
    duration: 3000,
    status: 'success',
    isClosable: true,
  }
}

export const makeErrorToast = (title: string, errMsg: string): UseToastOptions => {
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

const mappingsCategoriesEnumToDisplayName: StringToStringJSObject = {
  SocioCultural: 'Socio-cultural',
  Guips: 'GUIPs',
}

export const makeCategoriesPrettier = (igCategories: { [key: string]: string }) => {
  for (const mappingKey in mappingsCategoriesEnumToDisplayName) {
    igCategories[mappingKey] =
      mappingsCategoriesEnumToDisplayName[mappingKey as keyof StringToStringJSObject]
  }
  return igCategories
}

export const prettifyCategoriesInOrg = (orgs: OrganisationWithIGHead[]) => {
  const categoriesToPrettify = Object.keys(mappingsCategoriesEnumToDisplayName)
  return orgs.map((org) => {
    if (categoriesToPrettify.includes(org.category)) {
      org.category = mappingsCategoriesEnumToDisplayName[org.category]
    }
    return org
  })
}

export const unprettifyCategory = (category: string): string => {
  for (const [key, value] of Object.entries(mappingsCategoriesEnumToDisplayName)) {
    if (value === category) {
      return key
    }
  }
  return category
}
