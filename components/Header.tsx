import { Center, Box, useTheme, Stack, HStack, Link, StackDivider, Button } from "@chakra-ui/react";
import Image from "next/image";
import logo from '../public/logo.png';

type NavItem = {
    name: String;
    href: string
};

const NAV_ITEMS: Array<NavItem> = [ 
    {
        name: "Interest Groups",
        href: "/groups"
    }, 
    {
        name: "NOW!",
        href: "/now"
    },
    {
        name: "Houses",
        href: "/houses"
    },
    {
        name: "Events",
        href: "/events"
    }
];

export default function Header() {
    const theme = useTheme();
    return (
        <header>
            <Center m={3}>
                <Image 
                    src={logo}
                    alt="NUS College Logo"
                    width={200}
                />
            </Center>

            {/* Navbar */}
            <HStack
                align="center"
                justify="space-around"
                bg={theme.colors.primary.main}
                color="white"
                padding={4}
                >
                {
                    NAV_ITEMS.map((item: NavItem, idx) => {
                        return <Link href={item.href} key={idx}>{item.name}</Link>
                    })
                }
                
    
            </HStack>
        </header>
    );
};