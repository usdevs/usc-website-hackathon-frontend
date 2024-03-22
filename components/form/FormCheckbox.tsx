import { Checkbox, FormControl, FormErrorMessage } from '@chakra-ui/react'
import React from 'react'

import { BaseFormProps } from '@/types/form.types'

interface FormCheckboxProps extends BaseFormProps {
  field: {
    value: any
    onChange: React.ChangeEventHandler<HTMLInputElement>
    onBlur: React.FocusEventHandler<HTMLInputElement>
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

export default React.memo(FormCheckbox)
