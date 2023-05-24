import React from "react";
import { Box, Container, Flex, HStack, IconButton, LinkBox, LinkOverlay, Menu, MenuList, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import Image from "next/image";
import NUSCollegePic from "../public/nus-college-1@2x.png";

import dynamic from "next/dynamic";
import { BUTTON_LINKS } from "../utils";

const NavLink: React.FC<ButtonInfo> = (props) => (
  <LinkBox
    px={2}
    py={1}
    boxShadow={'inset 0 0 0 0 white'}
    color='white'
    margin='0 -.25rem'
    padding='0.25rem'
    transition='color .3s ease-in-out, box-shadow .3s ease-in-out'
    _hover={{
      boxShadow: 'inset 200px 0 0 0 white',
      color: 'brand.primary',
    }}
  >
    <Text fontFamily={'Domine'} fontSize={'24px'}>
      {props.name}
    </Text>
    <LinkOverlay href={props.link} />
  </LinkBox>
)

const Auth = dynamic(() => import('../components/Auth'), { ssr: false })
const NavMenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <LinkBox>
        <Box display={'flex'} justifyContent={'center'}>
          <Image src={NUSCollegePic} alt={'NUS College'} height={500} width={185} />
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
              {BUTTON_LINKS.map((info) => (
                <NavLink key={info.name} name={info.name} link={info.link} />
              ))}
            </HStack>
          </Container>
          <Flex alignItems={'center'}>
            <Menu>
              <Auth />
              <MenuList>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {BUTTON_LINKS.map((info) => (
                <NavLink key={info.name} name={info.name} link={info.link} />
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  )
}

export default NavMenu
