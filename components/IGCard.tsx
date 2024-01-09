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
import { FaTelegram, FaUser, FaUserCircle } from 'react-icons/fa'
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
  inviteLink: string
  primaryIGHead: User | null
}

const getContactButton = (contact: User | null, width?: string) => {
  return (
    <Button
      overflow='hidden'
      textOverflow={'ellipsis'}
      leftIcon={<FaUserCircle />}
      variant='outline'
      size='xs'
      colorScheme='facebook'
      minWidth={width || 'auto'}
      maxWidth={width || 'auto'}
      rounded='15px'
      style={{
        borderRadius: '0.5rem',
        border: '1px solid #144a70',
        display: 'flex',
        alignItems: 'center',
      }}
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
        leftIcon={<FaTelegram />}
        variant='outline'
        size='xs'
        colorScheme='telegram'
        minWidth={width || 'auto'}
        maxWidth={width || 'auto'}
        rounded='15px'
        style={{ borderRadius: '0.5rem', border: '1px solid #229ed9' }}
      >
        Invite Link
      </Button>
    </Link>
  )
}

const LeftPane: React.FC<LeftPaneProps> = ({
  imageKey,
  imageSrc,
  isInactive,
  inviteLink,
  primaryIGHead,
}) => {
  return (
    <VStack borderRight='1px solid darkgrey' align='center' justifyContent='space-apart'>
      <Center width='110px' flex={1}>
        <ImageWithFallback
          key={imageKey}
          fallbackSrc={'orgs/' + DEFAULT_PNG_NAME}
          width={120}
          height={120}
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
      <Center width='90%'>{getContactButton(primaryIGHead, '95px')}</Center>
      <Center width='90%' pb='7px'>
        {getInviteLinkButton(inviteLink, '95px')}
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
        style={{ minWidth: '100%', minHeight: '10rem' }}
      >
        <Card
          direction={{ base: 'row', sm: 'row' }}
          overflow='hidden'
          variant='elevated'
          shadow='md'
          onClick={onOpen}
          style={{ height: '100%' }}
          border='1px solid darkgrey'
        >
          <LeftPane
            imageKey={imageKey - 1}
            imageSrc={imageSrc}
            isInactive={ig_info.isInactive}
            inviteLink={inviteLink}
            primaryIGHead={primaryIGHead}
          />
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
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {ig_info.description}
              </Text>
            </CardBody>
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
