import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  InputLeftElement,
  InputGroup,
  useDisclosure,
} from '@chakra-ui/react'
import { EditIcon, DeleteIcon, AddIcon, SearchIcon } from '@chakra-ui/icons'

import Footer from '../../Footer'
import {
  getFromUrlArrayAndParseJson,
  getFromUrlStringAndParseJson,
  getFromUrlStringAndParseJsonWithAuth,
  isUserLoggedIn,
  makeFetchToUrlWithAuth,
} from '../../../utils'
import { useUserInfo } from '../../../hooks/useUserInfo'
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'
import { useState } from 'react'
import OrganisationControlFormPopup from './OrganisationControlFormPopup'
import defaultValues from './initialValues'
import validationSchema from './validationSchema'
import { makeSuccessOrgToast, makeErrorOrgToast } from '../../../utils/orgUtils'
import AdminTable from '../AdminTable'

function OrganisationControlForm() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [auth] = useUserInfo()
  const toast = useToast()
  const [initialValues, setInitialValues] = useState(defaultValues)

  // const {
  //   data: users,
  //   error: errorUsers,
  //   isLoading: isLoadingUsers,
  //   mutate: mutateUsers,
  // } = useSWR<User[], string[]>(
  //   auth?.token ? [process.env.NEXT_PUBLIC_BACKEND_URL + 'users', auth.token] : null,
  //   getFromUrlStringAndParseJsonWithAuth,
  // )

  const {
    data: orgs,
    error: errorOrgs,
    isLoading: isLoadingOrgs,
    mutate: mutateOrgs,
  } = useSWR<OrganisationWithIGHead[], string[]>(
    [process.env.NEXT_PUBLIC_BACKEND_URL, 'orgs'],
    getFromUrlArrayAndParseJson,
  )
  const {
    data: allOrgCategories,
    error: errorOrgCategories,
    isLoading: isLoadingOrgCategories,
  } = useSWRImmutable<{ [key: string]: string }, string>(
    process.env.NEXT_PUBLIC_BACKEND_URL + 'orgs/categories',
    getFromUrlStringAndParseJson,
  )

  if (!isUserLoggedIn(auth) || auth === null) {
    return <Box>Please log in first!</Box>
  }

  if (isLoadingOrgCategories || isLoadingOrgs) {
    return <Box>Fetching data! Spinner</Box>
  }

  if (errorOrgCategories || errorOrgs) {
    throw new Error("Could not fetch organisations' data from the backend")
  }

  const onSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    const { responseJson, responseStatus } = await makeFetchToUrlWithAuth(
      process.env.NEXT_PUBLIC_BACKEND_URL + 'org',
      auth.token,
      'POST',
      JSON.stringify(values),
    )

    if (responseStatus === 200) {
      toast(makeSuccessOrgToast())
      mutateOrgs()
    } else {
      toast(makeErrorOrgToast(JSON.stringify(responseJson.message)))
    }

    setSubmitting(false)
  }

  const categoryTemp: any = allOrgCategories // parse due to typing issue in backend

  const categories = Object.keys(categoryTemp).map((category: any) => {
    return {
      value: category,
      description: category,
    }
  })

  const openModalWithInitialValues = (initialValues: OrganisationForm) => {
    setInitialValues(initialValues)
    onOpen()
  }

  const toOrganisationFormFormat = (org: any) => {
    const {
      id,
      name,
      description,
      inviteLink,
      isAdminOrg,
      isInvisible,
      isInactive,
      category /*igHead, otherMembers */,
    } = org
    const rowFormValues = {
      id,
      name,
      description,
      inviteLink,
      isAdminOrg,
      isInvisible,
      isInactive,
      category,
      igHead: 22,
      otherMembers: [],
    }
    return rowFormValues
  }

  const columns = [
    {
      title: 'Name',
      field: 'name',
    },
    {
      title: 'Category',
      field: 'category',
    },
    {
      title: 'Invite Link',
      field: 'inviteLink',
    },
    {
      title: 'Admin Organisation',
      field: 'isAdminOrg',
      fieldToText: (value: boolean) => (value ? 'Yes' : 'No'),
    },
    {
      title: 'Inactive',
      field: 'isInactive',
      fieldToText: (value: boolean) => (value ? 'Yes' : 'No'),
    },
    {
      title: 'Invisible',
      field: 'isInvisible',
      fieldToText: (value: boolean) => (value ? 'Yes' : 'No'),
    },
  ]

  const onEdit = (rowData: any) => openModalWithInitialValues(toOrganisationFormFormat(rowData))
  const onDelete = (rowData: any) => {}
  const onAdd = () => openModalWithInitialValues(defaultValues)
  const headerText = 'Organisations and Interest Groups'
  const addButtonText = 'New Organisation'
  const searchFieldText = 'Search Organisations...'

  return (
    <>
      <AdminTable
        columns={columns}
        searchFilterField={'name'}
        headerText={headerText}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
        addButtonText={addButtonText}
        searchFieldText={searchFieldText}
        data={orgs}
      />
      <OrganisationControlFormPopup
        isOpen={isOpen}
        onClose={onClose}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        categories={categories}
        users={categories /* temp */}
      />
    </>
  )
}

export default OrganisationControlForm
