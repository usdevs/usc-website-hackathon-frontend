import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react'
import { Form, Formik } from 'formik'

import { OrganisationForm } from '@/types/bookings.types'
import { SelectProps } from '@/types/form.types'

import FormCheckbox from '@/components/form/FormCheckbox'
import FormMultiSelect from '@/components/form/FormMultiSelect'
import FormSelect from '@/components/form/FormSelect'
import FormTextArea from '@/components/form/FormTextArea'
import FormTextField from '@/components/form/FormTextField'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  initialValues: OrganisationForm
  validationSchema: any
  onSubmit: any
  categories: Array<SelectProps<string>>
  users: Array<SelectProps<number>>
}

function OrganisationControlFormPopup({
  isOpen,
  onClose,
  initialValues,
  validationSchema,
  onSubmit,
  categories,
  users,
}: ModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {Object.is(initialValues, initialValues) ? 'Add New Organisation' : 'Edit Organisation'}
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
                      label='IG Name'
                      field={form.getFieldProps('name')}
                      form={form}
                    />
                    <FormSelect
                      id='category'
                      name='category'
                      label='Category'
                      defaultValue={categories[0].value}
                      placeholder='Select a category...'
                      field={form.getFieldProps('category')}
                      form={form}
                      data={categories}
                    />
                    <FormSelect
                      id='igHead'
                      name='igHead'
                      label='Head'
                      defaultValue={users[0].value}
                      placeholder='Select an IG head...'
                      field={form.getFieldProps<number>('igHead')}
                      form={form}
                      data={users}
                    />
                    <FormMultiSelect
                      id='otherMembers'
                      name='otherMembers'
                      label='Other ExCo Members'
                      field={form.getFieldProps<number[]>('otherMembers')}
                      form={form}
                      options={users}
                      placeholder='Select a member...'
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
                    <Text>
                      Note that if a user is no longer the head or a member of the ExCo, any
                      bookings made by the user will also be deleted.
                    </Text>
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

export default OrganisationControlFormPopup
