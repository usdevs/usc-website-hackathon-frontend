import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Button,
} from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import FormTextField from '../../form/FormTextField'
import defaultValues from './initialValues'

type ModalProps = {
  isOpen: boolean
  onClose: any
  initialValues: User
  validationSchema: any
  onSubmit: any
}

function UserControlFormPopup({
  isOpen,
  onClose,
  initialValues,
  validationSchema,
  onSubmit,
}: ModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {Object.is(initialValues, defaultValues) ? 'Add New User' : 'Edit User'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {(form) => {
              return (
                <Form>
                  <VStack align='start' spacing={4}>
                    <FormTextField
                      type='text'
                      id='name'
                      name='name'
                      label='Name'
                      field={form.getFieldProps('name')}
                      form={form}
                    />
                    <FormTextField
                      type='text'
                      id='telegramUserName'
                      name='telegramUserName'
                      label='Telegram Username'
                      field={form.getFieldProps('telegramUserName')}
                      form={form}
                    />
                    <Button type='submit' colorScheme='teal' mt={4} isLoading={form.isSubmitting}>
                      Submit
                    </Button>
                  </VStack>
                </Form>
              )
            }}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default UserControlFormPopup
