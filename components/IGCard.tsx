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
  ButtonGroup,
  CardFooter,
  Stack,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { FaTelegram, FaUserCircle } from 'react-icons/fa'
import Link from 'next/link'
import ImageWithFallback from './ImageWithFallback'
import { DEFAULT_PNG_NAME } from '../utils'

interface IGInfoProps {
  ig_info: OrganisationWithIGHead
  imageKey: number
}

type LeftPaneProps = {
  imageKey: number
  imageSrc: string
  isInactive: boolean
}

const getContactButton = (contact: User | null, width?: string) => {
  // const toast = useToast()
  //
  // const copyToClipboard = () => {
  //   const nameToCopy = contact?.name || 'No contact found'
  //   navigator.clipboard.writeText(nameToCopy)
  //
  //   // Show toast alert
  //   toast({
  //     title: 'Copied to clipboard!',
  //     status: 'success',
  //     duration: 3000,
  //     isClosable: true,
  //     position: 'bottom',
  //   })
  // }
  //
  // const isContactFound = contact !== null && contact.name !== undefined

  return (
    <Button
      overflow='hidden'
      textOverflow={'ellipsis'}
      leftIcon={<FaUserCircle />}
      variant='outline'
      colorScheme='facebook'
      minWidth={width || 'auto'}
      maxWidth={width || 'auto'}
      rounded='15px'
      style={{
        borderRadius: '0.5rem',
        display: 'flex',
        alignItems: 'center',
      }}
      // onClick={copyToClipboard}
      // isDisabled={!isContactFound}
      isDisabled={true}
    >
      <Text noOfLines={[1]} display='inline' as='b'>
        {contact?.name || 'No contact found'}
      </Text>
    </Button>
  )
}

const getInviteLinkButton = (inviteLink: string, width?: string) => {
  return (
    <Link href={inviteLink} rel='noopener noreferrer' target='_blank'>
      <Button
        overflow='hidden'
        textOverflow={'ellipsis'}
        colorScheme='telegram'
        minWidth={width || 'auto'}
        maxWidth={width || 'auto'}
        rounded='15px'
        style={{ borderRadius: '0.5rem', border: '1px solid #229ed9' }}
      >
        <FaTelegram />
      </Button>
    </Link>
  )
}

const LeftPane: React.FC<LeftPaneProps> = ({ imageKey, imageSrc, isInactive }) => {
  return (
    <VStack borderRight='1px solid darkgrey' justifyContent='space-apart'>
      <Center width='130px' flex={1}>
        <ImageWithFallback
          key={imageKey}
          fallbackSrc={'orgs/' + DEFAULT_PNG_NAME}
          width={300}
          height={300}
          src={imageSrc}
          alt={imageSrc}
          style={{ objectFit: 'contain', padding: '12px' }}
          sizes='(max-width: 130) 100vw'
        />
        {isInactive ? (
          <Box
            position='absolute'
            top={2}
            right={2}
            bg='red.500'
            color='white'
            px={2}
            py={1}
            borderRadius='md'
            fontSize='sm'
            fontWeight='bold'
          >
            Inactive
          </Box>
        ) : (
          <></>
        )}
      </Center>
    </VStack>
  )
}

const IGCard: React.FC<IGInfoProps> = ({ imageKey, ig_info }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const igHeads: UserOnOrg[] = ig_info.userOrg.filter((userOnOrg) => userOnOrg.isIGHead)
  const igHeadsNames: string[] = igHeads.map((igHead) => igHead.user.name)
  const igHeadsDisplay: string =
    igHeadsNames.length > 0
      ? igHeadsNames.length === 1
        ? igHeadsNames[0]
        : igHeadsNames.join(', ')
      : 'No IG Heads'
  const primaryIGHead: User | null = igHeads.length > 0 ? igHeads[0].user : null
  const slug = ig_info.slug || DEFAULT_PNG_NAME
  const imageSrc = 'orgs/' + slug + '.png'
  const inviteLink =
    ig_info.inviteLink ||
    (igHeads.length > 0 ? 'https://t.me/' + primaryIGHead?.telegramUserName : '')

  return (
    <>
      <Box
        _hover={{ boxShadow: 'xl', transform: 'translateY(-3px)', cursor: 'pointer' }}
        transition='transform 0.3s, box-shadow 0.3s'
        style={{ minWidth: '100%', minHeight: '15rem' }}
      >
        <Card
          direction={{ base: 'column', sm: 'row' }}
          overflow='hidden'
          variant='elevated'
          shadow='md'
          onClick={onOpen}
          style={{ height: '100%' }}
          border='1px solid darkgrey'
        >
          <LeftPane imageKey={imageKey - 1} imageSrc={imageSrc} isInactive={ig_info.isInactive} />
          <Stack>
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
            <CardFooter>
              <ButtonGroup spacing='1'>
                {getInviteLinkButton(inviteLink)}
                {getContactButton(primaryIGHead)}
              </ButtonGroup>
            </CardFooter>
          </Stack>
        </Card>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size='xl'>
        <ModalOverlay />
        <ModalContent borderRadius={15}>
          {ig_info.isInactive ? (
            <Box
              position='absolute'
              top={2}
              left={2}
              bg='red.500'
              color='white'
              px={2}
              py={1}
              borderRadius='md'
              fontSize='md'
              fontWeight='bold'
            >
              Inactive
            </Box>
          ) : (
            <></>
          )}
          <Center borderBottom={'1px solid grey'} boxShadow={'md'}>
            <ImageWithFallback
              key={imageKey}
              fallbackSrc={'orgs/' + DEFAULT_PNG_NAME}
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
            <Text as='b' color={'gray.1000'}>
              {'Heads: ' + igHeadsDisplay}
            </Text>
            <Text color={'gray.500'}>{ig_info.description}</Text>
          </ModalBody>
          <ModalFooter justifyContent='flex-start'>
            <ButtonGroup spacing='1'>
              {getInviteLinkButton(inviteLink)}
              {getContactButton(primaryIGHead)}
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default IGCard
