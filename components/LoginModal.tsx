import {
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  PinInput,
  PinInputField,
  Spacer,
  Text,
  useBoolean,
  useDisclosure,
} from '@chakra-ui/react'
import { useState } from 'react'
import { FaCheck } from 'react-icons/fa'

type LoginForms = 'login' | 'code' | 'success'

const LoginModal = () => {
  // For controlling modal dialog
  const { isOpen, onOpen, onClose } = useDisclosure()
  // For controlling form state

  const Login = () => {
    const [isInvalid, setInvalid] = useBoolean(false)
    const [loginFormState, setLoginFormState] = useState<LoginForms>('login')
    const [username, setUsername] = useState('')
    const [otp, setOtp] = useState(['', '', '', ''])

    // Placeholder functions for handling login
    function requestForOtp() {
      return true
    }

    function submitOtp() {
      return true
    }

    function handleLogin() {
      const teleHandleFound = requestForOtp()
      if (teleHandleFound) {
        setLoginFormState('code')
      } else {
        setInvalid.on()
      }
    }

    function onOtpChange(index: number, n: string) {
      const pin = [...otp]
      pin[index] = n.toString()
      setOtp(pin)
    }

    function handleOtp() {
      const validOTP = submitOtp()
      if (validOTP) {
        setLoginFormState('success')
      } else {
        setInvalid.on()
      }
    }

    if (loginFormState == 'login') {
      return (
        <>
          <Flex gap={4} direction='column' justifyContent='flex-start'>
            <Heading textAlign={'center'}>Login</Heading>
            <Text fontSize={'medium'} textAlign={'center'}>
              Please log in with your registered telehandle to make booking for spaces.
            </Text>
            <Spacer />
            <FormControl px={4} isInvalid={isInvalid} h={100} isRequired>
              <FormLabel m={0}>Telehandle</FormLabel>
              <InputGroup borderRadius={0}>
                <InputLeftAddon borderRadius={0}>@</InputLeftAddon>
                <Input
                  py={2}
                  borderRadius={0}
                  id='username'
                  name='username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </InputGroup>
              <FormErrorMessage fontSize='xs'>Your telehandle could not be found.</FormErrorMessage>
            </FormControl>
          </Flex>
          <Flex justify='flex-end' w='100%' mt={16}>
            <Button onClick={handleLogin}>Next</Button>
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
            <FormControl isInvalid={isInvalid} h={100}>
              <HStack justify='center'>
                <PinInput id='otp' size='lg' otp placeholder='' isInvalid={isInvalid}>
                  {otp.map((n, index) => (
                    <PinInputField
                      key={index}
                      rounded='none'
                      value={n}
                      onChange={(e) => onOtpChange(index, e.target.value)}
                    ></PinInputField>
                  ))}
                </PinInput>
              </HStack>
              <FormErrorMessage fontSize={'xs'}>You have entered an invalid OTP.</FormErrorMessage>
            </FormControl>
          </Flex>
          <Flex justify='space-between' w='100%' mt={16}>
            <Button variant='link' onClick={requestForOtp}>
              Resend OTP
            </Button>
            <Button onClick={handleOtp}>Continue</Button>
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
