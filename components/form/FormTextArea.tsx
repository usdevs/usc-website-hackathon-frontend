import React from 'react'
import { FormControl, FormLabel, FormErrorMessage, Textarea } from '@chakra-ui/react'
import { BaseFromProps } from '../../types/form'

interface FormTextAreaProps extends BaseFromProps {
  field: {
    value: any
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>
    onBlur: React.FocusEventHandler<HTMLTextAreaElement>
  }
}

const FormTextArea: React.FC<FormTextAreaProps> = ({
  id,
  name,
  label,
  field,
  form: { errors, touched },
}) => {
  const error = errors[name]
  const showError = touched[name] && !!error

  return (
    <FormControl isInvalid={showError}>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <Textarea id={id} {...field} />
      {showError && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
}

export default React.memo(FormTextArea)
