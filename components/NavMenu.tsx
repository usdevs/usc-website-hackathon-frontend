import React from 'react'
import {
  Box, Flex, HStack, Stack, Text,
  IconButton,
  LinkBox, LinkOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons'
import dynamic from 'next/dynamic'
import { BUTTON_LINKS } from '../utils'
import { CldImage } from 'next-cloudinary'

const NavLink: React.FC<NavigationLink> = (props) => (
  <LinkBox
    px={2} py={1}
    boxShadow={'inset 0 0 0 0 white'}
    color='white'
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
    <Box bg='#1f407b'padding='1.5vh'>
      <Flex justifyContent={'center'} alignItems={'center'} position={'relative'} h={'10vh'}>
        <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            position={'absolute'}
            top={'50%'} left={'0'} transform={'translateY(-50%)'}
            onClick={isOpen ? onClose : onOpen}
          />
        <LinkBox display={'flex'} justifyContent={'center'} borderRadius={10} overflow={'hidden'}>
            <CldImage src={'nusc-logo'} alt={'NUS College'} height={420} width={190} />
            <LinkOverlay href={'/'} />
        </LinkBox>
        {/* TODO: CHANGE ICON */}
        <Box position={'absolute'} top={'50%'} right={'0'} transform={'translateY(-50%)'}>
          <Auth />
        </Box>
      </Flex>
      {/* Links to various pages in the Nav bar (IGs, NOW, etc.) */}
      <HStack as={'nav'} w={'80%'} display={{ base: 'none', md: 'flex'}}
        justifyContent={'space-between'} margin={'auto'} paddingTop='1rem'>
        <NavLinks />
      </HStack>
    </Box>

    {isOpen ? (
      <Box bg='#1f407b' w={'fit-content'} h={'100vh'} p={'1.5vh'}
        position={'fixed'} top={'0'} zIndex={'100'}>
        <Flex h={'10vh'} alignItems={'center'}>
          <IconButton
              size={'md'}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={'Open Menu'}
              onClick={isOpen ? onClose : onOpen}
            />
        </Flex>
        <Stack as={'nav'} spacing={4}>
          <NavLinks />
        </Stack>
      </Box>
    ) : null}
    </>
  )
}

export default NavMenu
