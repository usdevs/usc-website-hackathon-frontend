import React from 'react'
import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react'

interface FormTextFieldProps {
  id: string
  name: string
  label: string
  type: string
  field: {
    value: any
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void
  }
  form: {
    errors: { [key: string]: string | string[] }
    touched: { [key: string]: boolean }
  }
}

const FormTextField: React.FC<FormTextFieldProps> = ({
  id,
  name,
  label,
  type,
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
      <Input id={id} type={type} {...field} />
      {showError && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
}

export default React.memo(FormTextField, (prev, next) => prev.field.value === next.field.value)
