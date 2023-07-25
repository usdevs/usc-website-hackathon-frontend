import { Box, useToast, useDisclosure } from '@chakra-ui/react'
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
import AdminTable, { AdminTableColumnProps } from '../AdminTable'

function OrganisationControlForm() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [auth] = useUserInfo()
  const toast = useToast()
  const [initialValues, setInitialValues] = useState<OrganisationForm>(defaultValues)

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

  if (isLoadingOrgCategories || isLoadingOrgs || isLoadingUsers || !orgs || !allOrgCategories || !users) {
    return <Box>Fetching data! Spinner</Box>
  }

  if (errorOrgCategories || errorOrgs || errorUsers) {
    throw new Error("Could not fetch organisations' data from the backend")
  }

  const onSubmit = async (
    values: OrganisationForm,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    const { responseJson, responseStatus } = await makeFetchToUrlWithAuth(
      process.env.NEXT_PUBLIC_BACKEND_URL + 'org/' + values.id,
      auth.token,
      'PUT',
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

  const mappedUsers = users.map((user: User) => {
    return {
      value: user.id,
      description: user.telegramUserName,
    }
  })

  const openModalWithInitialValues = (initialValues: OrganisationForm) => {
    setInitialValues(initialValues)
    onOpen()
  }

  const convertToOrganisationForm = (org: OrganisationWithIGHead): OrganisationForm => {
    const igHead = org.userOrg.filter((org) => org.isIGHead)[0].user.id
    const otherMembers = org.userOrg.filter((org) => !org.isIGHead).map((org) => org.user.id)
    return { ...org, igHead, otherMembers }
  }

  const columns: AdminTableColumnProps[] = [
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

  const onEdit = (rowData: any) => openModalWithInitialValues(convertToOrganisationForm(rowData))
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
        users={mappedUsers}
      />
    </>
  )
}

export default OrganisationControlForm
