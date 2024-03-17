import { FormControl, FormErrorMessage, FormLabel, Select } from '@chakra-ui/react'
import React from 'react'

import { BaseFromProps } from '@/types/form.types'

import { SelectProps } from '@/components/admin/orgs/OrganisationControlFormPopup'

interface FormSelectProps<FieldValue> extends BaseFromProps {
  placeholder: string
  defaultValue: any
  field: {
    value: FieldValue
    onChange: React.ChangeEventHandler<HTMLSelectElement>
    onBlur: React.FocusEventHandler<HTMLSelectElement>
  }
  data: Array<{
    label: string
    value: FieldValue
  }>
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
            {item.label}
          </option>
        ))}
      </Select>
      {showError && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
}

export default React.memo(FormSelect)
