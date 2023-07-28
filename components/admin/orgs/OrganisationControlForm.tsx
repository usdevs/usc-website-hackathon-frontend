import { Box, useToast, useDisclosure } from '@chakra-ui/react'
import { makeFetchToUrlWithAuth, throwsErrorIfNullOrUndefined } from '../../../utils'
import { useUserInfo } from '../../../hooks/useUserInfo'
import { KeyedMutator } from 'swr'
import { useState } from 'react'
import OrganisationControlFormPopup from './OrganisationControlFormPopup'
import defaultValues from './initialValues'
import validationSchema from './validationSchema'
import { makeSuccessToast, makeErrorToast } from '../../../utils/orgUtils'
import AdminTable, { AdminTableColumnProps } from '../AdminTable'

type OrganisationControlFormProps = {
  users: any[] // to fix typing
  orgs: OrganisationWithIGHead[]
  categories: any[] // to fix type on backend
  mutateUsers: KeyedMutator<User[]>
  mutateOrgs: KeyedMutator<OrganisationWithIGHead[]>
}

function OrganisationControlForm({
  users,
  orgs,
  categories,
  mutateOrgs,
  mutateUsers,
}: OrganisationControlFormProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [authOrNull] = useUserInfo()
  const auth = throwsErrorIfNullOrUndefined(authOrNull)
  const toast = useToast()
  const [initialValues, setInitialValues] = useState<OrganisationForm>(defaultValues)

  const mappedCategories = categories.map((category: any) => {
    return {
      value: category,
      label: category,
    }
  })

  const onSubmit = async (
    values: OrganisationForm,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    // need to parse igHead to number type as HTML option by default will parse the field as string
    const parsedValues = { ...values, igHead: Number(values.igHead) }
    const { responseJson, responseStatus } = await makeFetchToUrlWithAuth(
      process.env.NEXT_PUBLIC_BACKEND_URL + `org/${parsedValues.id}`,
      auth.token,
      'PUT',
      JSON.stringify(parsedValues),
    )

    if (responseStatus === 200) {
      toast(
        makeSuccessToast(
          parsedValues.igHead === -1 ? `Org created successfully!` : `Org edited successfully`,
        ),
      )
      mutateOrgs()
      mutateUsers()
      onClose()
    } else {
      toast(
        makeErrorToast(
          'Oh snap! There was an error when making the org',
          JSON.stringify(responseJson.message),
        ),
      )
    }

    setSubmitting(false)
  }

  const mappedUsers = users.map((user: User) => {
    return {
      value: user.id,
      label: user.telegramUserName,
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
  // const onDelete = (rowData: any) => {}
  const onDelete = async (rowData: any) => {
    const { responseJson, responseStatus } = await makeFetchToUrlWithAuth(
      process.env.NEXT_PUBLIC_BACKEND_URL + 'org/' + rowData.id,
      auth.token,
      'DELETE',
      JSON.stringify(rowData),
    )

    if (responseStatus === 200) {
      toast(makeSuccessToast('Org deleted successfully'))
      mutateOrgs()
      mutateUsers()
    } else {
      toast(
        makeErrorToast(
          'Oh snap! There was an error when deleting the org',
          JSON.stringify(responseJson.message),
        ),
      )
    }
  }
  const onAdd = () => openModalWithInitialValues(defaultValues)
  const headerText = 'Organisations and Interest Groups'
  const addButtonText = 'New Organisation'
  const searchFieldText = 'Search Organisations...'
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
        data={orgs}
        itemsPerPage={itemsPerPage}
      />
      <OrganisationControlFormPopup
        isOpen={isOpen}
        onClose={onClose}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        categories={mappedCategories}
        users={mappedUsers}
      />
    </>
  )
}

export default OrganisationControlForm
