import React from 'react'
import { FormControl, FormLabel, Select, FormErrorMessage } from '@chakra-ui/react'
import { SelectProps } from '../admin/orgs/OrganisationControlFormPopup'

interface FormSelectProps<FieldValue> {
  id: string
  name: string
  label: string
  field: {
    value: FieldValue
    onChange: React.ChangeEventHandler<HTMLSelectElement>
    onBlur: React.FocusEventHandler<HTMLSelectElement>
  }
  form: {
    errors: { [key: string]: string | string[] }
    touched: { [key: string]: boolean }
  }
  data: Array<any>
}

const FormSelect = <T extends number | string>({
  id,
  name,
  label,
  field,
  data,
  form: { errors, touched },
}: FormSelectProps<T>) => {
  const error = errors[name]
  const showError = touched[name] && !!error

  return (
    <FormControl isInvalid={showError}>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <Select id={id} {...field}>
        {data.map((item: SelectProps<T>, i: number) => (
          <option key={i} value={item.value}>
            {item.description}
          </option>
        ))}
      </Select>
      {showError && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
}

export default React.memo(FormSelect, (prev, next) => prev.field.value === next.field.value)
