import React from 'react'
import { Card, Select } from '@chakra-ui/react'

interface SelectCardProps {
  label: string
  optionName: string
  options: string[]
}

const SelectCard: React.FC<SelectCardProps> = ({ label, optionName, options }) => {
  return (
    <Card
      display='flex'
      alignItems='center'
      p={4}
      mb={4}
      size='md'
      direction={{ base: 'column', lg: 'row' }}
      overflow='hidden'
      variant='outline'
      width='70%'
      bg='AliceBlue'
    >
      <label style={{ width: '200px' }}>{label + ': '}</label>
      <Select placeholder={'Select ' + optionName} bg='white' size='md' style={{ flex: 1 }}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </Card>
  )
}

export default SelectCard
