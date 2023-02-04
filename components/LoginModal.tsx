import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  HStack,
  Text,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Spacer,
  InputGroup,
  InputLeftAddon,
  PinInput,
  PinInputField,
  Center,
} from '@chakra-ui/react'
import { useState } from 'react'
import { FaCheck } from 'react-icons/fa'

type LoginForms = 'login' | 'code' | 'success'

const LoginModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [loginFormState, setLoginFormState] = useState<LoginForms>('success')

  const Login = () => {
    if (loginFormState == 'login') {
      return (
        <>
          <Flex gap={4} direction='column' justifyContent='flex-start'>
            <Heading textAlign={'center'}>Login</Heading>
            <Text fontSize={'medium'} textAlign={'center'}>
              Please log in with your registered telehandle to make booking for spaces.
            </Text>
            <Spacer />
            <FormControl px={4}>
              <FormLabel m={0}>Telehandle</FormLabel>
              <InputGroup borderRadius={0}>
                <InputLeftAddon borderRadius={0}>@</InputLeftAddon>
                <Input py={2} borderRadius={0} />
              </InputGroup>
            </FormControl>
          </Flex>
          <Flex justify='flex-end' w='100%' mt={16}>
            <Button onClick={onClose}>Next</Button>
          </Flex>
        </>
      )
    } else if (loginFormState == 'code') {
      return (
        <>
          <Flex gap={4} direction='column' justifyContent='flex-start'>
            <Heading textAlign={'center'}>Enter OTP Code</Heading>
            <Text fontSize={'medium'} textAlign={'center'}>
              Please enter the 4-digit OTP sent to your telehandle (@xxxxxxxx)
            </Text>
            <Spacer />
            <HStack justify='center'>
              <PinInput size='lg' otp placeholder=''>
                <PinInputField rounded='none' />
                <PinInputField rounded='none' />
                <PinInputField rounded='none' />
                <PinInputField rounded='none' />
              </PinInput>
            </HStack>
          </Flex>
          <Flex justify='space-between' w='100%' mt={16}>
            <Button variant='link'>Resend OTP</Button>
            <Button onClick={onClose}>Continue</Button>
          </Flex>
        </>
      )
    } else if (loginFormState == 'success') {
      return (
        <>
          <Flex gap={4} direction='column' justifyContent='flex-start' px={4}>
            <Heading textAlign={'center'}>Success!</Heading>
            <Center>
              <FaCheck color='lightgreen' fontSize='100px' />
            </Center>
            <Text fontSize={'medium'} textAlign={'center'}>
              You can now make bookings for spaces. For the latest guidelines on bookings, please
              click here.
            </Text>
          </Flex>
          <Flex justify='flex-end' w='100%' mt={8}>
            <Button onClick={onClose}>Done</Button>
          </Flex>
        </>
      )
    } else {
      return <></>
    }
  }

  return (
    <>
      <Button onClick={onOpen}>Login</Button>

      <Modal isOpen={isOpen} onClose={onClose} size='sm'>
        <ModalOverlay />
        <ModalContent borderRadius={0} pt={8} pb={4}>
          <ModalCloseButton />
          <ModalBody>
            <Login />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
export default LoginModal
