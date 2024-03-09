import React from 'react'
import { FormControl, FormLabel, FormErrorMessage, Textarea } from '@chakra-ui/react'
import { BaseFromProps } from '../../types/form'

type TextareaProps = React.ComponentProps<typeof Textarea>

interface FormTextAreaProps extends BaseFromProps {
  field: {
    value: any
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>
    onBlur: React.FocusEventHandler<HTMLTextAreaElement>
  }
  minHeight?: TextareaProps['minHeight']
}

const FormTextArea: React.FC<FormTextAreaProps> = ({
  id,
  name,
  label,
  field,
  form: { errors, touched },
  minHeight,
}) => {
  const error = errors[name]
  const showError = touched[name] && !!error

  return (
    <FormControl isInvalid={showError}>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <Textarea id={id} {...field} minHeight={minHeight} />
      {showError && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
}

export default React.memo(FormTextArea)
