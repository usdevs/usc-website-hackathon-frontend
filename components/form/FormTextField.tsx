import React from 'react'
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  Text,
} from '@chakra-ui/react'
import { BaseFromProps } from '../../types/form'

interface FormTextFieldProps extends BaseFromProps {
  type: string
  field: {
    value: any
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void
  }
  inputLeftElementText?: string
}

const FormTextField: React.FC<FormTextFieldProps> = ({
  id,
  name,
  label,
  type,
  field,
  form: { errors, touched },
  inputLeftElementText,
}) => {
  const error = errors[name]
  const showError = touched[name] && !!error

  return (
    <FormControl isInvalid={showError}>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <InputGroup>
        {inputLeftElementText ? (
          <InputLeftElement pointerEvents='none' color='gray.300' fontSize='1.2em'>
            <Text>{inputLeftElementText}</Text>
          </InputLeftElement>
        ) : (
          <></>
        )}
        <Input id={id} type={type} {...field} />
      </InputGroup>
      {showError && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
}

export default React.memo(FormTextField)
