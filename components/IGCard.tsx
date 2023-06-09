import { Button, Card, CardBody, Heading, Image, Stack, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { ExpandableText } from './ExpandableText'
import { FaUserCircle } from 'react-icons/fa'
import Link from 'next/link'

interface IGInfoProps {
  ig_info: IGInfo
}

const LeftPane: React.FC<IGInfoProps> = ({ ig_info }) => {
  const { contact, invite_link, image } = ig_info

  return (
    <VStack padding='1rem' borderRight='2px solid darkgrey'>
      <Image objectFit='cover' maxW={{ base: '100%' }} src={image} alt='IG Picture' />
      <Button
        overflow='hidden'
        textOverflow='ellipsis'
        variant='outline'
        colorScheme='blue'
        leftIcon={<FaUserCircle />}
        minWidth='8vw'
        maxWidth='8vw'
        style={{
          borderRadius: '0.5rem',
          color: '#1f407b',
          border: '1px solid #1f407b',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Text noOfLines={[1]}>{contact}</Text>
      </Button>
      <Button
        as={Link}
        href={invite_link}
        rel='noopener noreferrer'
        target='_blank'
        variant='outline'
        minWidth='8vw'
        maxWidth='8vw'
        style={{ borderRadius: '0.5rem', color: '#229ed9', border: '1px solid #229ed9' }}
      >
        Invite Link
      </Button>
    </VStack>
  )
}

const IGCard: React.FC<IGInfoProps> = ({ ig_info }) => {
  const { title, description } = ig_info
  return (
    <Card
      padding='1rem'
      direction={{ base: 'column', sm: 'row' }}
      overflow='hidden'
      variant='outline'
    >
      <LeftPane ig_info={ig_info} />
      <Stack>
        <CardBody>
          <Heading fontSize={'2xl'} fontFamily={'body'}>
            {title}
          </Heading>

          <ExpandableText noOfLines={3}>
            <Text color={'gray.500'}>{description}</Text>
          </ExpandableText>
        </CardBody>
      </Stack>
    </Card>
  )
}

export default IGCard
