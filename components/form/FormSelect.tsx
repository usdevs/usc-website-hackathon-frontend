import React from 'react'
import { FormControl, FormLabel, Select, FormErrorMessage } from '@chakra-ui/react'
import { SelectProps } from '../admin/orgs/OrganisationControlFormPopup'

interface FormSelectProps<FieldValue> {
  id: string
  name: string
  label: string
  placeholder: string
  defaultValue: any
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
  placeholder,
  defaultValue,
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
        <option disabled hidden value={defaultValue}>
          {placeholder}
        </option>
        {data.map((item: SelectProps<T>, i: number) => (
          <option key={i} value={item.value}>
            {item.label}
          </option>
        ))}
      </Select>
      {showError && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
}

export default React.memo(FormSelect)
