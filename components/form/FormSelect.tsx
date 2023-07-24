import React from 'react'
import { FormControl, FormLabel, Select, FormErrorMessage } from '@chakra-ui/react'

interface FormSelectProps {
  id: string
  name: string
  label: string
  field: {
    value: any
    onChange: React.ChangeEventHandler<HTMLSelectElement>
    onBlur: React.FocusEventHandler<HTMLSelectElement>
  }
  form: {
    errors: { [key: string]: string | string[] }
    touched: { [key: string]: boolean }
  }
}

const FormSelect: React.FC<FormSelectProps> = ({
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
      <Select id={id} {...field}>
        <option value='option2'>Option 2</option>
        <option value='Others'>Others</option>
        <option value='option3'>Option 3</option>
      </Select>
      {showError && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
}

export default React.memo(FormSelect, (prev, next) => prev.field.value === next.field.value)
