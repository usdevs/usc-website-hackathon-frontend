import React from 'react'
import {
  Box,
  Card,
  Center,
  Checkbox,
  CheckboxGroup,
  Divider,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Stack,
  VStack,
  useBreakpointValue,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { DEFAULT_FILTERS } from '../pages/student-groups'

type IGSearchFilterProps = {
  onInput: React.FormEventHandler<HTMLInputElement>
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onInactiveChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  interestGroupCategories: StringToStringJSObject
}

const IGSearchFilter: React.FC<IGSearchFilterProps> = ({
  onInput,
  onChange,
  onInactiveChange,
  interestGroupCategories,
}) => {
  const isGrid = useBreakpointValue({ base: true, md: false })

  const CheckboxLayout = () => {
    const checkboxes = Object.entries(interestGroupCategories).map((category) => (
      <Checkbox onChange={onChange} key={category[0]} value={category[0]}>
        {category[1]}
      </Checkbox>
    ))
    if (isGrid) {
      return (
        <SimpleGrid columns={2} spacing={2} mt='0.5rem'>
          {checkboxes}
          <Checkbox onChange={onInactiveChange} value={'Inactive'}>
            Inactive
          </Checkbox>
        </SimpleGrid>
      )
    } else {
      return (
        <HStack mt='0.5rem' spacing={[1, 5]}>
          {checkboxes}
          <Divider borderColor={'black'} border='1px' orientation='vertical' />
          <Checkbox onChange={onInactiveChange} value={'Inactive'}>
            Inactive
          </Checkbox>
        </HStack>
      )
    }
  }

  return (
    <VStack width='100%' margin={'1rem'}>
      <InputGroup width={{ base: '95%', sm: '95%', md: '60%' }}>
        <InputLeftElement pointerEvents='none' fontSize='1.3em' paddingTop={2}>
          <SearchIcon color='gray.600' />
        </InputLeftElement>
        <Input
          type='text'
          borderRadius={20}
          _placeholder={{ opacity: 1, color: 'gray.600' }}
          placeholder='Search'
          onInput={onInput}
          size={'lg'}
        />
      </InputGroup>
      <CheckboxGroup colorScheme='green' defaultValue={DEFAULT_FILTERS}>
        <CheckboxLayout />
      </CheckboxGroup>
    </VStack>
  )
}

export default IGSearchFilter
