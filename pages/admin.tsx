import type { NextPage } from 'next'
import { Box, Button, Flex, Heading, useToast, UseToastOptions, VStack } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import Footer from '../components/Footer'
import {
  getFromUrlArrayAndParseJson,
  getFromUrlStringAndParseJson,
  getFromUrlStringAndParseJsonWithAuth,
  isUserLoggedIn,
  makeFetchToUrlWithAuth,
} from '../utils'
import { useUserInfo } from '../hooks/useUserInfo'
import FormTextField from '../components/form/FormTextField'
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'

const ORGANISATION_TOAST_ID = 'organisation-toast'

const makeSuccessOrgToast = (): UseToastOptions => {
  return {
    id: ORGANISATION_TOAST_ID,
    title: `Success! It will take at most a day to regenerate the student groups page and reflect your changes.`,
    position: 'top',
    duration: 3000,
    status: 'success',
    isClosable: true,
  }
}

const makeErrorOrgToast = (errMsg: string): UseToastOptions => {
  return {
    id: ORGANISATION_TOAST_ID,
    title: 'Oh snap! There was an error when making the org.',
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

const initialValues: OrganisationForm = {
  id: -1,
  name: '',
  description: '',
  inviteLink: '',
  // photoUpload: null,
  isAdminOrg: false,
  isInvisible: false,
  isInactive: false,
  category: 'Others',
  igHead: 22,
  otherMembers: [],
}

const AdminPage: NextPage = () => {
  const [auth] = useUserInfo()
  const toast = useToast()
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
  } = useSWR<BookingDataBackend[], string[]>(
    [process.env.NEXT_PUBLIC_BACKEND_URL, 'orgs'],
    getFromUrlArrayAndParseJson,
  )
  const {
    data: allOrgCategories,
    error: errorOrgCategories,
    isLoading: isLoadingOrgCategories,
  } = useSWRImmutable<Organisation[], string>(
    process.env.NEXT_PUBLIC_BACKEND_URL + 'orgs/categories',
    getFromUrlStringAndParseJson,
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

  if (!auth.isAdminUser) {
    return <Box>You need to be an admin!</Box>
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

  return (
    <Flex justify='center' flexDir='column' as='main'>
      <Button
        size='sm'
        variant='outline'
        _hover={{ transform: 'scale(1.2)' }}
        _active={{ transform: 'scale(0.9)' }}
        onClick={() => {
          console.log(auth.token)
        }}
      >
        Get it
      </Button>
      <Box p='3rem'>
        <Heading as='h2' size='md' mb={4}>
          IG Application Form
        </Heading>
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
                <FormTextField
                  type='text'
                  id='igHead'
                  name='igHead'
                  label='Head'
                  field={form.getFieldProps('igHead')}
                  form={form}
                />
                <FormTextField
                  type='text'
                  id='description'
                  name='description'
                  label='Description'
                  field={form.getFieldProps('description')}
                  form={form}
                />
                <FormTextField
                  type='text'
                  id='inviteLink'
                  name='inviteLink'
                  label='Invite Link'
                  field={form.getFieldProps('inviteLink')}
                  form={form}
                />
                {/*<FormControl>*/}
                {/*  <FormLabel htmlFor='photoUpload'>Photo Upload</FormLabel>*/}
                {/*  <Input type='file' id='photoUpload' name='photoUpload' />*/}
                {/*</FormControl>*/}
                <Button type='submit' colorScheme='teal' mt={4} isLoading={form.isSubmitting}>
                  Submit
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
      </Box>
      <Footer />
    </Flex>
  )
}

export default AdminPage
