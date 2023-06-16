import {
  Button,
  Card,
  CardBody,
  Heading,
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
import ImageWithFallback from './ImageWithFallback'

interface IGInfoProps {
  ig_info: OrganisationWithIGHead
  imageKey: number
}

type LeftPaneProps = {
  imageKey: number
  igHead: string
  imageSrc: string
  inviteLink: string
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

const getInviteLinkButton = (inviteLink: string) => {
  return (
    <Link href={inviteLink} rel='noopener noreferrer' target='_blank'>
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

const LeftPane: React.FC<LeftPaneProps> = ({ imageKey, igHead, imageSrc, inviteLink }) => {
  return (
    <VStack padding='1rem' borderRight='2px solid darkgrey' justifyContent='space-apart'>
      <Center flex={1}>
        <ImageWithFallback
          key={imageKey}
          fallbackSrc={'/orgs/Default.png'}
          width={100}
          height={100}
          src={imageSrc}
          alt={imageSrc}
          style={{ objectFit: 'contain' }}
          sizes='(max-width: 130) 100vw'
        />
      </Center>
      {getContactButton(igHead)}
      {getInviteLinkButton(inviteLink)}
      
    </VStack>
  )
}

const IGCard: React.FC<IGInfoProps> = ({ imageKey, ig_info }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const firstUserOnOrg: UserOnOrg | null = ig_info?.userOrg?.length > 0 ? ig_info?.userOrg[0] : null
  const igHead: string = firstUserOnOrg?.user?.name || 'No name'
  const slug = ig_info?.slug || 'Default.png'
  const imageSrc = '/orgs/' + slug + '.png'
  const inviteLink = ig_info?.inviteLink || 'https://t.me/' + firstUserOnOrg?.user?.telegramUserName

  return (
    <>
      <MotionBox
        whileHover={{ scale: 1.03, cursor: 'pointer' }}
        transition={{ duration: 0.3 }}
        style={{ minWidth: '100%', minHeight: '15rem' }}
      >
        <Card
          direction={{ base: 'column', sm: 'row' }}
          overflow='hidden'
          variant='outline'
          shadow='md'
          onClick={onOpen}
          style={{ height: '100%' }}
        >
          <LeftPane
            imageKey={imageKey - 1}
            igHead={igHead}
            imageSrc={imageSrc}
            inviteLink={inviteLink}
          />
          <Divider orientation='vertical' h='85%' my='auto' />
          <Center>
            <CardBody>
              <Heading fontSize={'2xl'} fontFamily={'body'}>
                {ig_info.name}
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
          <Center>
            <ImageWithFallback
              key={imageKey}
              fallbackSrc={'/orgs/Default.png'}
              src={imageSrc}
              alt='Modal Image'
              width={300}
              height={300}
              style={{ padding: '2rem', objectFit: 'contain' }}
              sizes='(max-height: 350) 100vh'
            />
          </Center>

          <ModalHeader>{ig_info.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color={'gray.500'}>{ig_info.description}</Text>
          </ModalBody>
          <ModalFooter justifyContent='flex-start'>
            <Box mr={2}>{getContactButton(igHead)}</Box>
            {getInviteLinkButton(inviteLink)}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default IGCard
