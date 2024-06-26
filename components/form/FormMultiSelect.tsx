import { FormControl, FormLabel } from '@chakra-ui/react'
import { FieldInputProps, FormikProps } from 'formik'
import React from 'react'
import Select, { MultiValue } from 'react-select'

import { OrganisationForm } from '@/types/bookings.types'
import { BaseFormProps, SelectProps } from '@/types/form.types'

// Adapted from https://codesandbox.io/s/formik-react-select-multi-typescript-qsrj2?file=/src/CustomSelect.tsx
interface CustomMultiSelectProps extends BaseFormProps {
  field: FieldInputProps<number[]>
  form: FormikProps<OrganisationForm>
  options: SelectProps<number>[]
  placeholder?: string
}

export const FormMultiSelect = ({
  id,
  name,
  label,
  field,
  options,
  placeholder,
  form,
}: CustomMultiSelectProps) => {
  const onChange = (options: MultiValue<SelectProps<number>>) => {
    form.setFieldValue(
      name,
      options.map((item) => item.value),
    )
  }

  const getValue = () => {
    return options ? options.filter((option) => field.value.indexOf(option.value) >= 0) : []
  }

  return (
    <FormControl>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <Select
        id={id}
        name={field.name}
        value={getValue()}
        onChange={onChange}
        placeholder={placeholder}
        options={options}
        closeMenuOnSelect={false}
        isMulti={true}
      />
    </FormControl>
  )
}

export default React.memo(FormMultiSelect)
