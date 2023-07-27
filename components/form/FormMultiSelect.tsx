import React from 'react'
import Select, { MultiValue } from 'react-select'
import { SelectProps } from '../admin/orgs/OrganisationControlFormPopup'
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react'
import { FieldInputProps, FormikProps } from 'formik'

// Adapted from https://codesandbox.io/s/formik-react-select-multi-typescript-qsrj2?file=/src/CustomSelect.tsx

interface CustomMultiSelectProps<FieldValue> {
  id: string
  name: string
  label: string
  field: FieldInputProps<number[]>
  form: FormikProps<OrganisationForm>
  options: SelectProps<number>[]
  placeholder?: string
}

export const FormMultiSelect = <T extends number[]>({
  id,
  name,
  label,
  field,
  options,
  placeholder,
  form,
}: CustomMultiSelectProps<T>) => {
  const error = String(form.errors[name as keyof OrganisationForm])
  const showError = form.touched[name as keyof OrganisationForm] && !!error

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
    <FormControl isInvalid={showError}>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <Select
        id={id}
        name={field.name}
        value={getValue()}
        onChange={onChange}
        placeholder={placeholder}
        options={options}
        isMulti={true}
      />
      {showError && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
}

export default React.memo(FormMultiSelect, (prev, next) => prev.field.value === next.field.value)
