import React from "react";
import {
    Avatar,
    Box,
    Button,
    Container,
    Flex,
    HStack,
    IconButton,
    LinkBox,
    LinkOverlay,
    Menu,
    MenuButton,
    MenuList,
    Stack,
    Text,
    useColorModeValue,
    useDisclosure
} from "@chakra-ui/react";
import {CloseIcon, HamburgerIcon} from "@chakra-ui/icons";
import Image from "next/image";
import NUSCollegePic from "../public/nus-college-1@2x.png";
import TelegramLoginButton, { TelegramUser } from "./TelegramLoginButton";
import Auth from "../features/auth/Auth";

const BUTTON_LINKS: ButtonInfo[] = [
    {name: "Interest Groups", link: "/interest-groups"},
    {name: "Houses", link: "#"},
    {name: "NOW!", link: "#"},
    {name: "Events", link: "#"}
]

const NavLink: React.FC<ButtonInfo> = (props) => (
    <LinkBox
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.800', 'gray.200'),
        }}
    >
        <Text color='white'
              fontFamily={'Domine'}
              fontSize={'24px'}>{props.name}</Text>
        <LinkOverlay href={props.link}/>
    </LinkBox>
);

const NavMenu = () => {
    const {isOpen, onOpen, onClose} = useDisclosure();

    return <>
        <LinkBox>
            <Box display={"flex"} justifyContent={"center"}>
                <Image
                    src={NUSCollegePic}
                    alt={"NUS College"}
                    height={500}
                    width={185}/>
                <LinkOverlay href={"https://nuscollege.nus.edu.sg"}/>
            </Box>
        </LinkBox>
        <Box px={4} bg="#1f407b">
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                <IconButton
                    size={'md'}
                    icon={isOpen ? <CloseIcon/> : <HamburgerIcon/>}
                    aria-label={'Open Menu'}
                    display={{md: 'none'}}
                    onClick={isOpen ? onClose : onOpen}
                />
                <Container centerContent>
                    <HStack
                        as={'nav'}
                        spacing={36}
                        display={{base: 'none', md: 'flex'}}>
                        {BUTTON_LINKS.map((info) =>
                            <NavLink key={info.name} name={info.name} link={info.link}/>
                        )}
                       <Auth />
                    </HStack>
                </Container>
                {/*<Flex alignItems={'center'}>*/}
                      {/*<Menu>*/}
                        {/*<MenuButton*/}
                        {/*    as={Button}*/}
                        {/*    rounded={'full'}*/}
                        {/*    variant={'link'}*/}
                        {/*    cursor={'pointer'}*/}
                        {/*    minW={0}>*/}
                        {/*    <Avatar*/}
                        {/*        size={'sm'}*/}
                        {/*        src={*/}
                        {/*            'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'*/}
                        {/*        }*/}
                        {/*    />*/}
                        {/*</MenuButton>*/}
                        {/*<MenuList>*/}
                            {/*<MenuItem>Link 1</MenuItem>*/}
                            {/*<MenuItem>Link 2</MenuItem>*/}
                            {/*<MenuDivider/>*/}
                            {/*<MenuItem>Link 3</MenuItem>*/}
                        {/*</MenuList>*/}
                    {/*</Menu>*/}
                {/*</Flex>*/}
            </Flex>

            {isOpen ? (
                <Box pb={4} display={{md: 'none'}}>
                    <Stack as={'nav'} spacing={4}>
                        {BUTTON_LINKS.map((info) =>
                            <NavLink key={info.name} name={info.name} link={info.link}/>
                        )}
                    </Stack>
                </Box>
            ) : null}
        </Box>
    </>;
}

export default NavMenu;
