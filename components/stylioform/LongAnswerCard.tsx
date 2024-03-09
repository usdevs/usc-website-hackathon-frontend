import React from 'react'
import { Card, Textarea } from '@chakra-ui/react'

interface LongAnswerCardProps {
  label: string
  prompt: string
}

const LongAnswerCard: React.FC<LongAnswerCardProps> = ({ label, prompt }) => {
  return (
    <Card
      display='flex-column'
      gap={2}
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
      <label style={{ width: '200px', marginRight: '10px' }}>{label + ': '}</label>
      <br />
      <Textarea
        placeholder={prompt}
        size='md'
        variant='outline'
        bg='white'
        style={{ flex: 1, height: '200px' }}
      />
    </Card>
  )
}

export default LongAnswerCard
