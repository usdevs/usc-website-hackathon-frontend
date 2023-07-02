import type { NextPage } from 'next'
import NavMenu from '../components/NavMenu'
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, VStack } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import Footer from '../components/Footer'
import { isUserLoggedIn } from '../utils'
import { useUserInfo } from '../hooks/useUserInfo'
import FormTextField from '../components/form/FormTextField'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  head: Yup.string().required('Head is required'),
  description: Yup.string().required('Description is required'),
  inviteLink: Yup.string().required('Invite Link is required'),
})

const initialValues = {
  name: '',
  head: '',
  description: '',
  inviteLink: '',
  photoUpload: null,
}

const AdminPage: NextPage = () => {
  const [auth] = useUserInfo()

  const onSubmit = (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    console.log(values)
    setSubmitting(false)
    // Perform your API call using the form values
    // Example:
    // api.post('/your-endpoint', values)
    //   .then((response) => {
    //     // Handle success response
    //     console.log('Form submitted successfully!');
    //   })
    //   .catch((error) => {
    //     // Handle error response
    //     console.error('Error submitting form:', error);
    //   })
    //   .finally(() => {
    //     setSubmitting(false);
    //   });
  }

  return (
    <Flex justify='center' flexDir='column' as='main'>
      <NavMenu />
      <Button
        size='sm'
        variant='outline'
        _hover={{ transform: 'scale(1.2)' }}
        _active={{ transform: 'scale(0.9)' }}
        onClick={() => {
          if (isUserLoggedIn(auth)) {
            console.log(auth?.token)
          } else {
            console.log('Log in first!')
          }
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
                  id='head'
                  name='head'
                  label='Head'
                  field={form.getFieldProps('head')}
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
                <FormControl>
                  <FormLabel htmlFor='photoUpload'>Photo Upload</FormLabel>
                  <Input type='file' id='photoUpload' name='photoUpload' />
                </FormControl>
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
