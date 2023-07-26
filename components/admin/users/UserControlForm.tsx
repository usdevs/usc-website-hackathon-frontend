import { useToast, useDisclosure, Box } from '@chakra-ui/react'
import {
  getFromUrlArrayAndParseJson,
  getFromUrlStringAndParseJson,
  getFromUrlStringAndParseJsonWithAuth,
  isUserLoggedIn,
  makeFetchToUrlWithAuth,
} from '../../../utils'
import { useUserInfo } from '../../../hooks/useUserInfo'
import { useState } from 'react'
import UserControlFormPopup from './UserControlFormPopup'
import defaultValues from './initialValues'
import validationSchema from './validationSchema'
import { makeSuccessOrgToast, makeErrorOrgToast } from '../../../utils/orgUtils'
import AdminTable, { AdminTableColumnProps } from '../AdminTable'
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'

function UserControlForm() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [auth] = useUserInfo()
  const toast = useToast()
  const [initialValues, setInitialValues] = useState<User>(defaultValues)

  const {
    data: users,
    error: errorUsers,
    isLoading: isLoadingUsers,
    mutate: mutateUsers,
  } = useSWR<User[], string[]>(
    auth?.token ? [process.env.NEXT_PUBLIC_BACKEND_URL + 'users', auth.token] : null,
    getFromUrlStringAndParseJsonWithAuth,
  )
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

  if (
    isLoadingOrgCategories ||
    isLoadingOrgs ||
    isLoadingUsers ||
    !orgs ||
    !allOrgCategories ||
    !users
  ) {
    return <Box>Fetching data! Spinner</Box>
  }

  if (errorOrgCategories || errorOrgs || errorUsers) {
    throw new Error("Could not fetch organisations' data from the backend")
  }

  const onSubmit = async (
    values: User,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    let fetchUrl
    let method
    if (values.id === -1) {
      fetchUrl = process.env.NEXT_PUBLIC_BACKEND_URL + `user`
      method = 'POST'
    } else {
      fetchUrl = process.env.NEXT_PUBLIC_BACKEND_URL + `user/${values.id}`
      method = 'PUT'
    }
    const { responseJson, responseStatus } = await makeFetchToUrlWithAuth(
      fetchUrl,
      auth.token,
      method,
      JSON.stringify(values),
    )

    if (responseStatus === 200) {
      toast(
        makeSuccessOrgToast(
          values.id === -1 ? `User created successfully!` : `User edited successfully`,
        ),
      )
      mutateOrgs()
      mutateUsers()
      onClose()
    } else {
      toast(
        makeErrorOrgToast(
          'Oh snap! There was an error when making the user',
          JSON.stringify(responseJson.message),
        ),
      )
    }

    setSubmitting(false)
  }

  const openModalWithInitialValues = (initialValues: User) => {
    setInitialValues(initialValues)
    onOpen()
  }

  const columns: AdminTableColumnProps[] = [
    {
      title: 'Name',
      field: 'name',
    },
    {
      title: 'Telegram Username',
      field: 'telegramUserName',
    },
  ]

  const onEdit = (rowData: any) => openModalWithInitialValues(rowData)

  const onDelete = async (rowData: any) => {
    const { responseJson, responseStatus } = await makeFetchToUrlWithAuth(
      process.env.NEXT_PUBLIC_BACKEND_URL + 'user/' + rowData.id,
      auth.token,
      'DELETE',
      JSON.stringify(rowData),
    )

    if (responseStatus === 200) {
      toast(makeSuccessOrgToast('User deleted successfully'))
      mutateOrgs()
      mutateUsers()
    } else {
      toast(
        makeErrorOrgToast(
          'Oh snap! There was an error when deleting the user',
          JSON.stringify(responseJson.message),
        ),
      )
    }
  }
  const onAdd = () => openModalWithInitialValues(defaultValues)
  const headerText = 'Users'
  const addButtonText = 'New User'
  const searchFieldText = 'Search Users...'
  const searchFilterField = 'name'
  const itemsPerPage = 10

  return (
    <>
      <AdminTable
        columns={columns}
        searchFilterField={searchFilterField}
        headerText={headerText}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
        addButtonText={addButtonText}
        searchFieldText={searchFieldText}
        data={users}
        itemsPerPage={itemsPerPage}
      />
      <UserControlFormPopup
        isOpen={isOpen}
        onClose={onClose}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      />
    </>
  )
}

export default UserControlForm
