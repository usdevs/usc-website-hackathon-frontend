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
import React from 'react'
import FormCheckbox from '../../form/FormCheckbox'
import FormSelect from '../../form/FormSelect'
import FormTextArea from '../../form/FormTextArea'
import FormTextField from '../../form/FormTextField'

type OrganisationForm = Omit<Organisation, 'slug'> & {
  igHead: number
  otherMembers: number[]
}

type SelectProps = {
  value: string
  description: string
}

type ModalProps = {
  isOpen: boolean
  onClose: any
  initialValues: OrganisationForm
  validationSchema: any
  onSubmit: any
  categories: Array<SelectProps>
  users: Array<SelectProps>
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
                    data={users}
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
  )
}

export default OrganisationControlFormPopup
