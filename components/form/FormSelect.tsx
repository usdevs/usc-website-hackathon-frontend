import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react'
import React from 'react'
import Select from 'react-select'

import { BaseFormProps } from '@/types/form.types'
import { SelectProps } from '@/types/form.types'

interface FormSelectProps<FieldValue> extends BaseFormProps {
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
  defaultValue,
  form,
}: FormSelectProps<T>) => {
  const { errors, touched } = form
  const error = errors[name]
  const showError = touched[name] && !!error

  return (
    <FormControl isInvalid={showError}>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <Select
        id={id}
        defaultValue={defaultValue}
        options={data}
        value={data.find((option) => option.value === field.value)}
        // @ts-expect-error
        name={field.name}
        onChange={(option: SelectProps<T> | null) =>
          // TODO: Properly type all form types
          // @ts-expect-error
          form.setFieldValue(name, option.value)
        }
      />
      {showError && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
}

export default React.memo(FormSelect)
