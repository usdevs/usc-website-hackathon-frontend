import { SearchIcon } from '@chakra-ui/icons'
import {
  Checkbox,
  CheckboxGroup,
  Divider,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
} from '@chakra-ui/react'
import React from 'react'

import { DEFAULT_FILTERS } from '@/pages/student-groups'

import { StringToStringJSObject } from '@/types/auth.types'

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
  return (
    <VStack margin={'2rem'}>
      <InputGroup>
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
        <Flex flexDir={{ base: 'column', md: 'row' }} gap={{ base: 2, md: 4 }}>
          {Object.entries(interestGroupCategories).map((category) => (
            <Checkbox onChange={onChange} key={category[0]} value={category[0]}>
              {category[1]}
            </Checkbox>
          ))}
          <Divider borderColor={'black'} border='1px' orientation='vertical' />
          <Checkbox onChange={onInactiveChange} value={'Inactive'}>
            Inactive
          </Checkbox>
        </Flex>
      </CheckboxGroup>
    </VStack>
  )
}

export default IGSearchFilter
