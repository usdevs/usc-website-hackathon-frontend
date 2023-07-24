import type { NextPage } from 'next'
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalFooter,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  UseToastOptions,
  InputLeftElement,
  InputGroup,
  VStack,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import { EditIcon, DeleteIcon, AddIcon, SearchIcon } from '@chakra-ui/icons'
import * as Yup from 'yup'
import Footer from '../Footer'
import {
  fetchFromUrlArrayAndParseJson,
  fetchFromUrlStringAndParseJson,
  isUserLoggedIn,
} from '../../utils'
import { useUserInfo } from '../../hooks/useUserInfo'
import FormTextField from '../form/FormTextField'
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'
import FormTextArea from '../form/FormTextArea'
import FormSelect from '../form/FormSelect'
import FormCheckbox from '../form/FormCheckbox'
import { useState } from 'react'

const ORGANISATION_TOAST_ID = 'organisation-toast'

const makeSuccessOrgToast = (): UseToastOptions => {
  return {
    id: ORGANISATION_TOAST_ID,
    title: `Org created successfully!`,
    position: 'top',
    duration: 3000,
    status: 'success',
    isClosable: true,
  }
}

const makeErrorOrgToast = (errMsg: string): UseToastOptions => {
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

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  igHead: Yup.number().required('Head is required'),
  description: Yup.string().required('Description is required'),
  inviteLink: Yup.string().required('Invite Link is required'),
})

type OrganisationForm = Omit<Organisation, 'slug'> & {
  igHead: number
  otherMembers: number[]
}
const defaultValues: OrganisationForm = {
  id: -1,
  name: '',
  description: '',
  inviteLink: '',
  // photoUpload: null,
  isAdminOrg: false,
  isInvisible: false,
  isInactive: false,
  category: '',
  igHead: -1,
  otherMembers: [],
}

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

  console.log(orgs)

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
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Organisation</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {(form) => (
                  <Form>
                    <VStack align='start' spacing={4}>
                      <FormTextField
                        type='text'
                        id='name'
                        name='name'
                        label='IG Name'
                        field={form.getFieldProps('name')}
                        form={form}
                      />
                      <FormSelect
                        id='igHead'
                        name='igHead'
                        label='Head'
                        field={form.getFieldProps('igHead')}
                        form={form}
                        data={categories}
                      />
                      <FormSelect
                        id='category'
                        name='category'
                        label='Category'
                        field={form.getFieldProps('category')}
                        form={form}
                        data={categories}
                      />
                      <FormTextArea
                        id='description'
                        name='description'
                        label='Description'
                        field={form.getFieldProps('description')}
                        form={form}
                      />
                      {/*<FormControl>*/}
                      {/*  <FormLabel htmlFor='photoUpload'>Photo Upload</FormLabel>*/}
                      {/*  <Input type='file' id='photoUpload' name='photoUpload' />*/}
                      {/*</FormControl>*/}
                      <FormTextField
                        type='text'
                        id='inviteLink'
                        name='inviteLink'
                        label='Invite Link'
                        field={form.getFieldProps('inviteLink')}
                        form={form}
                      />
                      <FormCheckbox
                        id='isAdminOrg'
                        name='isAdminOrg'
                        label='Admin Organisation?'
                        field={form.getFieldProps('isAdminOrg')}
                        form={form}
                      />
                      <FormCheckbox
                        id='isInactive'
                        name='isInactive'
                        label='Inactive?'
                        field={form.getFieldProps('isInactive')}
                        form={form}
                      />
                      <FormCheckbox
                        id='isInvisible'
                        name='isInvisible'
                        label='Invisible?'
                        field={form.getFieldProps('isInvisible')}
                        form={form}
                      />
                      <Button type='submit' colorScheme='teal' mt={4} isLoading={form.isSubmitting}>
                        Submit
                      </Button>
                    </VStack>
                  </Form>
                )}
              </Formik>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
      <Footer />
    </Flex>
  )
}

export default OrganisationControlForm
