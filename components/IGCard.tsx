import {
  Button,
  Card,
  CardBody,
  Heading,
  Image,
  Box,
  Center,
  Divider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  VStack,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import React from 'react'
import { FaUserCircle } from 'react-icons/fa'
import Link from 'next/link'

interface IGInfoProps {
  ig_info: IGInfo
}

const MotionBox = motion(Box)

const getContactButton = (contact: string) => {
  return (
    <Button
      overflow='hidden'
      textOverflow={'ellipsis'}
      leftIcon={<FaUserCircle />}
      variant='outline'
      colorScheme='blue'
      minWidth={'7vw'}
      maxWidth={'7vw'}
      rounded='15px'
      style={{
        borderRadius: '0.5rem',
        color: '#1f407b',
        border: '1px solid #1f407b',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Text noOfLines={[1]} display='inline'>
        {contact}
      </Text>
    </Button>
  )
}

const getInviteLinkButton = (invite_link: string) => {
  return (
    <Link href={invite_link} rel='noopener noreferrer' target='_blank'>
      <Button
        overflow='hidden'
        textOverflow={'ellipsis'}
        variant='outline'
        colorScheme='blue'
        minWidth={'7vw'}
        maxWidth={'7vw'}
        rounded='15px'
        style={{ borderRadius: '0.5rem', color: '#229ed9', border: '1px solid #229ed9' }}
      >
        Invite Link
      </Button>
    </Link>
  )
}

const LeftPane: React.FC<IGInfoProps> = ({ ig_info }) => {
  const { contact, invite_link, image } = ig_info

  return (
    <VStack padding='1rem' borderRight='2px solid darkgrey'>
      <Center>
        <Image
          objectFit='cover'
          maxW={{ base: '100%', sm: '130px' }}
          src={image}
          alt='IG Picture'
        />
      </Center>
      {getContactButton(contact)}
      {getInviteLinkButton(invite_link)}
    </VStack>
  )
}

const IGCard: React.FC<IGInfoProps> = ({ ig_info }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <MotionBox whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
        <Card
          direction={{ base: 'column', sm: 'row' }}
          overflow='hidden'
          variant='outline'
          shadow='md'
          onClick={onOpen}
        >
          <LeftPane ig_info={ig_info} />
          <Divider
            orientation='vertical'
            borderColor='blackAlpha.400'
            borderLeftWidth='2px'
            h='85%'
            my='auto'
          />
          <Center>
            <CardBody>
              <Heading fontSize={'2xl'} fontFamily={'body'}>
                {ig_info.title}
              </Heading>
              <Text
                color='gray.500'
                pt='1vh'
                css={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {ig_info.description}
              </Text>
            </CardBody>
          </Center>
        </Card>
      </MotionBox>

      <Modal isOpen={isOpen} onClose={onClose} size='xl'>
        <ModalOverlay />
        <ModalContent>
          <Image src={ig_info.image} alt='Modal Image' maxH='350px' objectFit='cover' />
          <ModalHeader>{ig_info.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color={'gray.500'}>{ig_info.description}</Text>
          </ModalBody>
          <ModalFooter justifyContent='flex-start'>
            <Box mr={2}>{getContactButton(ig_info.contact)}</Box>
            {getInviteLinkButton(ig_info.invite_link)}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default IGCard
