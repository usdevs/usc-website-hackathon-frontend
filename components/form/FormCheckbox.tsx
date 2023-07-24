import React from 'react'
import { FormControl, FormLabel, Checkbox, FormErrorMessage } from '@chakra-ui/react'

interface FormCheckboxProps {
  id: string
  name: string
  label: string
  field: {
    value: any
    onChange: React.ChangeEventHandler<HTMLInputElement>
    onBlur: React.FocusEventHandler<HTMLInputElement>
  }
  form: {
    errors: { [key: string]: string | string[] }
    touched: { [key: string]: boolean }
  }
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({
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
      <Checkbox id={id} isChecked={field.value} {...field}>
        {label}
      </Checkbox>
      {showError && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
}

export default React.memo(FormCheckbox, (prev, next) => prev.field.value === next.field.value)
