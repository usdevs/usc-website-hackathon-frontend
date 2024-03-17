import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react'
import React from 'react'
import Select, { SingleValue } from 'react-select'

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
        onChange={(option: SingleValue<SelectProps<number>>) =>
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
