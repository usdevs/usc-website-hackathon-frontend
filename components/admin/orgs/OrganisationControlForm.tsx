import type { NextPage } from 'next'
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
  fetchFromUrlArrayAndParseJson,
  fetchFromUrlStringAndParseJson,
  isUserLoggedIn,
} from '../../../utils'
import { useUserInfo } from '../../../hooks/useUserInfo'
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'
import { useState } from 'react'
import OrganisationControlFormPopup from './OrganisationControlFormPopup'
import defaultValues from './initialValues'
import validationSchema from './validationSchema'
import { makeSuccessOrgToast, makeErrorOrgToast } from '../../../utils/orgUtils'

function OrganisationControlForm() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [auth] = useUserInfo()
  const toast = useToast()

  const [initialValues, setInitialValues] = useState(defaultValues)
  const {
    data: orgs,
    error: errorOrgs,
    isLoading: isLoadingOrgs,
    mutate,
  } = useSWR<BookingDataBackend[], string[]>(
    [process.env.NEXT_PUBLIC_BACKEND_URL, 'orgs'],
    fetchFromUrlArrayAndParseJson,
  )

  const {
    data: users,
    error: errorUsers,
    isLoading: isLoadingUsers,
  } = useSWR<BookingDataBackend[], string[]>(
    [process.env.NEXT_PUBLIC_BACKEND_URL, 'users'],
    fetchFromUrlArrayAndParseJson,
  )

  const {
    data: allOrgCategories,
    error: errorOrgCategories,
    isLoading: isLoadingOrgCategories,
  } = useSWRImmutable<Organisation[], string>(
    process.env.NEXT_PUBLIC_BACKEND_URL + 'orgs/categories',
    fetchFromUrlStringAndParseJson,
  )

  if (!isUserLoggedIn(auth) || auth === null) {
    return <Box>Please log in first!</Box>
  }

  if (isLoadingOrgCategories || isLoadingOrgs || isLoadingUsers) {
    return <Box>Fetching data! Spinner</Box>
  }

  if (errorOrgCategories || errorOrgs || errorUsers) {
    throw new Error("Could not fetch organisations' data from the backend")
  }

  const onSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    const token = auth.token
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(values),
    }
    const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'org', requestOptions)
    const data = await response.json()

    if (response.status === 200) {
      toast(makeSuccessOrgToast())
      mutate()
      onClose()
    } else {
      toast(makeErrorOrgToast(JSON.stringify(data.message)))
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

  const renderOrganisationRow = (org: any) => {
    return (
      <>
        {columns.map((column) => (
          <Td>{column.fieldToText ? column.fieldToText(org[column.field]) : org[column.field]}</Td>
        ))}
      </>
    )
  }

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

  return (
    <Flex justify='center' flexDir='column' as='main'>
      <Box p='3rem'>
        <Flex justify='space-between' alignItems='center' mb={50}>
          <Heading as='h1' size='lg'>
            Organisations and Interest Groups
          </Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme='teal'
            variant='solid'
            onClick={() => openModalWithInitialValues(defaultValues)}
          >
            Add New Organisation
          </Button>
        </Flex>
        <InputGroup mb={25}>
          <Input pl='4.5rem' type='text' placeholder='Search organisations...' />
          <InputLeftElement width='4.5rem'>
            <SearchIcon />
          </InputLeftElement>
        </InputGroup>

        <TableContainer>
          <Table variant='striped'>
            <Thead>
              <Tr>
                {columns.map((column) => (
                  <Th key={column.field}>{column.title}</Th>
                ))}
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orgs?.map((org, idx) => (
                <Tr key={idx}>
                  {renderOrganisationRow(org)}
                  <Td>
                    <Button
                      onClick={() => openModalWithInitialValues(toOrganisationFormFormat(org))}
                      leftIcon={<EditIcon />}
                      colorScheme='blue'
                      variant='outline'
                      mr={5}
                    >
                      Edit
                    </Button>
                    <Button leftIcon={<DeleteIcon />} colorScheme='red' variant='solid'>
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <OrganisationControlFormPopup
          isOpen={isOpen}
          onClose={onClose}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          categories={categories}
          users={categories /* temp */}
        />
      </Box>
      <Footer />
    </Flex>
  )
}

export default OrganisationControlForm
