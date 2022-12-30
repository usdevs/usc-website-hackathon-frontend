import type {NextPage} from "next";
import React from "react";
import NavMenu from "../components/NavMenu";
import {Flex, Box, Stack, Text, useBreakpointValue, VStack, SimpleGrid} from '@chakra-ui/react';
import Footer from '../components/Footer';
import BigCard from "../components/BigCard";

const BUTTON_LINKS: ButtonInfo[] = [
    {name: "IGs", link: "#"},
    {name: "Houses", link: "#"},
    {name: "NOW!", link: "#"},
    {name: "NUSC Committee", link: "#"}
]

const HeroSection = () => {
    return (
        <Flex
            w={'full'}
            h={'90vh'}
            backgroundImage={
                'url(/image1.png)'
            }
            backgroundSize={'cover'}
            backgroundPosition={'center center'}
        >
            <VStack
                w={'full'}
                justify={'center'}
                px={useBreakpointValue({base: 4, md: 8})}
                // bgGradient={'linear(to-r, blackAlpha.600, transparent)'}
            >
                <Stack
                    // maxW={'2xl'}
                    align={'flex-start'}
                    // spacing={10}
                >
                    <Text
                        color={'white'}
                        // fontWeight={700}
                        lineHeight={0.8}
                        fontFamily={"Do Hyeon"}
                        fontSize={useBreakpointValue({base: '60px', md: '120px'})}>
                        welcome to
                    </Text>
                    <Text
                        color={'#f90'}
                        fontFamily={"Do Hyeon"}
                        lineHeight={0.8}
                        fontSize={useBreakpointValue({base: '120px', md: '240px'})}>
                        CINNAMON
                    </Text>
                    <Text
                        color={'white'}
                        fontFamily={"Do Hyeon"}
                        lineHeight={0.8}
                        fontSize={useBreakpointValue({base: '60px', md: '120px'})}>
                        student life
                    </Text>
                    <Box
                        as='button'
                        rounded={'full'}
                        height='60px'
                        transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
                        px='8px'
                        fontSize='40px'
                        fontFamily={"Domine"}
                        fontWeight='bold'
                        bg='#f90'
                        color='white'
                        _hover={{ bg: '#ebedf0' }}
                        _active={{
                            bg: '#dddfe2',
                            transform: 'scale(0.98)',
                            borderColor: '#bec3c9',
                        }}
                        _focus={{
                            boxShadow:
                                '0 0 1px 2px rgba(88, 144, 255, .75), 0 1px 1px rgba(0, 0, 0, .15)',
                        }}
                    >  Learn More  </Box>
                </Stack>
            </VStack>
        </Flex>
    );
}

const LandingPage: NextPage = () => {
    return (
        <Flex
            justify="center"
            flexDir="column"
            as="main"
        >
            <NavMenu/>
            <HeroSection/>
            <Box mx={'80px'} my={'80px'}>
            <SimpleGrid minChildWidth='500px' spacingX='20px' spacingY='20px'>
                <BigCard name={BUTTON_LINKS[0].name} link={BUTTON_LINKS[0].link} key={0}/>
                <BigCard name={BUTTON_LINKS[1].name} link={BUTTON_LINKS[1].link} key={1}/>
                <BigCard name={BUTTON_LINKS[2].name} link={BUTTON_LINKS[2].link} key={2}/>
                <BigCard name={BUTTON_LINKS[3].name} link={BUTTON_LINKS[3].link} key={3}/>
            </SimpleGrid>
            </Box>
            <Footer/>
        </Flex>
    );
};

export default LandingPage;
