import React from 'react'
import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from '@chakra-ui/react'

interface FormTextAreaProps {
  id: string
  name: string
  label: string
  field: {
    value: any
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>
    onBlur: React.FocusEventHandler<HTMLTextAreaElement>
  }
  form: {
    errors: { [key: string]: string | string[] }
    touched: { [key: string]: boolean }
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
  console.log(touched[name])
  console.log(error)

  return (
    <FormControl isInvalid={showError}>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <Textarea id={id} {...field} />
      {showError && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
}

export default React.memo(FormTextArea, (prev, next) => prev.field.value === next.field.value)
