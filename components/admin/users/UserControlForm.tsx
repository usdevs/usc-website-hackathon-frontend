import { useDisclosure, useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { KeyedMutator } from 'swr'

import { makeFetchToUrlWithAuth } from '@/utils/booking'
import { makeErrorToast, makeSuccessToast } from '@/utils/orgUtils'

import { OrganisationWithIGHead, User } from '@/types/bookings.types'

import { useUserInfoNonNull } from '@/hooks/useUserInfo'

import AdminTable, { AdminTableColumnProps } from '@/components/admin/AdminTable'
import UserControlFormPopup from '@/components/admin/users/UserControlFormPopup'
import defaultValues from '@/components/admin/users/initialValues'
import validationSchema from '@/components/admin/users/validationSchema'

type UserControlFormProps = {
  users: User[]
  mutateUsers: KeyedMutator<User[]>
  mutateOrgs: KeyedMutator<OrganisationWithIGHead[]>
}

function UserControlForm({ users, mutateUsers, mutateOrgs }: UserControlFormProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [auth] = useUserInfoNonNull()
  const toast = useToast()
  const [initialValues, setInitialValues] = useState<User>(defaultValues)

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
        makeSuccessToast(
          values.id === -1 ? `User created successfully!` : `User edited successfully`,
        ),
      )
      mutateOrgs()
      mutateUsers()
      onClose()
    } else {
      toast(
        makeErrorToast(
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
      toast(makeSuccessToast('User deleted successfully'))
      mutateOrgs()
      mutateUsers()
    } else {
      toast(
        makeErrorToast(
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
