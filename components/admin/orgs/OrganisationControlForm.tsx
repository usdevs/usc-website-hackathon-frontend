import { useDisclosure, useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { KeyedMutator } from 'swr'

import { makeFetchToUrlWithAuth } from '@/utils/booking'
import {
  makeErrorToast,
  makeSuccessToast,
  prettifyCategoriesInOrg,
  unprettifyCategory,
} from '@/utils/orgUtils'

import { OrganisationForm, OrganisationWithIGHead, User } from '@/types/bookings.types'

import { useUserInfoNonNull } from '@/hooks/useUserInfo'

import AdminTable, { AdminTableColumnProps } from '@/components/admin/AdminTable'
import OrganisationControlFormPopup from '@/components/admin/orgs/OrganisationControlFormPopup'
import defaultValues from '@/components/admin/orgs/initialValues'
import validationSchema from '@/components/admin/orgs/validationSchema'

type OrganisationControlFormProps = {
  users: User[]
  orgs: OrganisationWithIGHead[]
  categories: { [key: string]: string }
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
  const [auth] = useUserInfoNonNull()
  const toast = useToast()
  const [initialValues, setInitialValues] = useState<OrganisationForm>(defaultValues)

  const mappedCategories = []
  for (const [key, value] of Object.entries(categories)) {
    mappedCategories.push({
      value: key,
      label: value,
    })
  }

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
          parsedValues.id === -1 ? `Org created successfully!` : `Org edited successfully`,
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
    const possibleIgHead = org.userOrg.filter((org) => org.isIGHead)
    if (possibleIgHead.length !== 1) {
      throw new Error('Either too many IG Heads detected or no IG Head found for ' + org.name)
    }
    const igHead = possibleIgHead[0].user.id
    const otherMembers = org.userOrg.filter((org) => !org.isIGHead).map((org) => org.user.id)
    const category = unprettifyCategory(org.category)
    return { ...org, category, igHead, otherMembers }
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

  const onEdit = (rowData: OrganisationWithIGHead) =>
    openModalWithInitialValues(convertToOrganisationForm(rowData))
  const onDelete = async (rowData: OrganisationWithIGHead) => {
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
        data={prettifyCategoriesInOrg(orgs)}
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
