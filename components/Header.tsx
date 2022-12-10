import { Center, Box, useTheme } from "@chakra-ui/react";
import Image from "next/image";
import logo from '../public/logo.png';

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
            <Box backgroundColor={theme.colors.primary.main} color={'white'}>
                
            </Box>
        </header>
    );
};