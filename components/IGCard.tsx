import {
  Box,
  Card,
  Center,
  CardBody,
  Heading,
  Image,
  Text,
  Divider,
  VStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import React from 'react'
import { ExpandableText } from './ExpandableText'
import { FaUserCircle } from 'react-icons/fa'
import Link from 'next/link'

interface IGInfoProps {
  ig_info: IGInfo
}

const MotionBox = motion(Box)

const LeftPane: React.FC<IGInfoProps> = (props) => {
  return (
    <Box pt={'2vh'} pb={'2vh'} w='60vw'>
      <Center>
        <Image
          objectFit='cover'
          maxW={{ base: '100%', sm: '130px' }}
          src={props.ig_info.image}
          alt='IG Picture'
        />
      </Center>
      <Box pt={'1vh'}>
        <VStack>
          <Button
            overflow='hidden'
            textOverflow={'ellipsis'}
            leftIcon={<FaUserCircle />}
            variant='outline'
            colorScheme='blue'
            minWidth={'7vw'}
            maxWidth={'7vw'}
            rounded='15px'
          >
            <Text noOfLines={[1]} display='inline'>
              {props.ig_info.contact}
            </Text>
          </Button>
          <Link href={props.ig_info.invite_link} rel='noopener noreferrer' target='_blank'>
            <Button
              overflow='hidden'
              textOverflow={'ellipsis'}
              variant='outline'
              colorScheme='blue'
              minWidth={'7vw'}
              maxWidth={'7vw'}
              rounded='15px'
            >
              Invite Link
            </Button>
          </Link>
        </VStack>
      </Box>
    </Box>
  )
}

const IGCard: React.FC<IGInfoProps> = (props) => {
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
          <LeftPane ig_info={props.ig_info} />
          <Divider
            orientation='vertical'
            borderColor='blackAlpha.400'
            borderLeftWidth='2px'
            h='85%'
            my='auto'
          />
          <Center>
            <CardBody>
              <Heading
                // color={useColorModeValue('gray.700', 'white')}
                fontSize={'2xl'}
                fontFamily={'body'}
              >
                {props.ig_info.title}
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
                {props.ig_info.description}
              </Text>
            </CardBody>
          </Center>
        </Card>
      </MotionBox>

      <Modal isOpen={isOpen} onClose={onClose} size='xl'>
        <ModalOverlay />
        <ModalContent>
          <Image src={props.ig_info.image} alt='Modal Image' maxH='350px' objectFit='cover' />
          <ModalHeader>{props.ig_info.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color={'gray.500'}>{props.ig_info.description}</Text>
          </ModalBody>
          <ModalFooter justifyContent='flex-start'>
            <Box mr={2}>
              <Button
                overflow='hidden'
                textOverflow={'ellipsis'}
                leftIcon={<FaUserCircle />}
                variant='outline'
                colorScheme='blue'
                minWidth={'8vw'}
                maxWidth={'8vw'}
                rounded='15px'
              >
                <Text noOfLines={[1]} display='inline'>
                  {props.ig_info.contact}
                </Text>
              </Button>
            </Box>
            <Box>
              <Link href={props.ig_info.invite_link} rel='noopener noreferrer' target='_blank'>
                <Button
                  overflow='hidden'
                  textOverflow={'ellipsis'}
                  variant='outline'
                  colorScheme='blue'
                  minWidth={'8vw'}
                  maxWidth={'8vw'}
                  rounded='15px'
                >
                  Invite Link
                </Button>
              </Link>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default IGCard
