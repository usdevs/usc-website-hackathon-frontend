import React from 'react'
import {
  Box,
  Container,
  Flex,
  HStack,
  IconButton,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
  Heading,
  useDisclosure,
} from '@chakra-ui/react'
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons'
import dynamic from 'next/dynamic'
import { BUTTON_LINKS } from '../utils'
import Image from 'next/image'
import NUSCollegePic from '../public/nusc-logo.png'

const NavLink: React.FC<NavigationLink> = (props) => (
  <LinkBox
    px={2}
    py={1}
    boxShadow={'inset 0 0 0 0 white'}
    color='white'
    margin='0 -.25rem'
    padding='0.25rem'
    transition='color .3s ease-in-out, box-shadow .3s ease-in-out'
    _hover={{
      color: '#ff9900',
    }}
  >
    <Text fontFamily={'Domine'} fontSize={'24px'}>
      {props.label}
    </Text>
    <LinkOverlay href={props.href} />
  </LinkBox>
)

const Auth = dynamic(() => import('../components/Auth'), { ssr: false })

const NavLinks = () => {
  return (
    <>
      {BUTTON_LINKS.map((info) => (
        <NavLink key={info.label} {...info} />
      ))}
    </>
  )
}

const NavMenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <LinkBox>
        <Box display={'flex'} justifyContent={'center'} padding='0.5rem'>
          {/*<Heading as='h1' size='2xl' color='#1f407b' fontFamily={'Blender-Medium'}>*/}
          {/*  NUS{' '}*/}
          {/*  <Text as='span' color='#ef7c00'>*/}
          {/*    College*/}
          {/*  </Text>{' '}*/}
          {/*  Club*/}
          {/*</Heading>*/}
           <Image src={NUSCollegePic} alt={'NUS College'} height={420} width={190} />
          <LinkOverlay href={'/'} />
        </Box>
      </LinkBox>
      <Box px={4} bg='#1f407b'>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <Container centerContent>
            {/* Links to various pages in the Nav bar (IGs, NOW, etc.) */}
            <HStack as={'nav'} spacing={36} display={{ base: 'none', md: 'flex' }}>
              <NavLinks />
            </HStack>
          </Container>
          <Flex alignItems={'center'}>
            <Auth />
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              <NavLinks />
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  )
}

export default NavMenu
