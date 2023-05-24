import type { NextPage } from 'next'
import React from 'react'
import NavMenu from '../components/NavMenu'
import {
  AspectRatio,
  Heading,
  Flex,
  Box,
  Stack,
  Text,
  useBreakpointValue,
  VStack,
  SimpleGrid,
  GridItem,
} from '@chakra-ui/react'
import Footer from '../components/Footer'
import HomePageCard from '../components/HomePageCard'
import HeroBg from '../public/image1.png'
import Image from 'next/image'

const BUTTON_LINKS: ButtonInfo[] = [
  { name: 'IGs', link: '#' },
  { name: 'Houses', link: '#' },
  { name: 'NOW!', link: '#' },
  { name: 'NUSC Committee', link: '#' },
]

const HeroSection = () => {
  return (
    <Flex position={'relative'} height='90vh' width='full'>
      <Image
        alt='Mountains'
        src={HeroBg}
        placeholder='blur'
        quality={100}
        fill
        sizes='100vw'
        style={{
          objectFit: 'cover',
          position: 'absolute',
          zIndex: -1,
        }}
      />
      <VStack
        w={'full'}
        justify={'center'}
        px={useBreakpointValue({ base: 4, md: 8 })}
        // bgGradient={'linear(to-r, blackAlpha.600, transparent)'}
      >
        <Stack
          // maxW={'2xl'}
          align={'flex-start'}
          // spacing={10}
        >
          <Text
            color={'white'}
            fontWeight={500}
            letterSpacing={'wide'}
            lineHeight={0.8}
            fontFamily={'Do Hyeon'}
            fontSize={{ base: '60px', md: '90px', xl: '120px' }}
          >
            welcome to
          </Text>
          <Text
            color={'#f90'}
            fontFamily={'Do Hyeon'}
            lineHeight={0.8}
            fontSize={useBreakpointValue({ base: '90px', md: '200px', xl: '240px' })}
          >
            NUSC
          </Text>
          <Text
            color={'white'}
            fontFamily={'Do Hyeon'}
            lineHeight={0.8}
            fontSize={useBreakpointValue({ base: '60px', md: '90px', xl: '120px' })}
          >
            student life
          </Text>
          <Box
            as='button'
            rounded={'full'}
            height='full'
            transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
            py='2'
            px='4'
            fontSize={{ base: '2xl', md: '4xl' }}
            fontFamily={'Domine'}
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
              boxShadow: '0 0 1px 2px rgba(88, 144, 255, .75), 0 1px 1px rgba(0, 0, 0, .15)',
            }}
          >
            Learn More
          </Box>
        </Stack>
      </VStack>
    </Flex>
  )
}

const LandingPage: NextPage = () => {
  return (
    <Flex justify='center' flexDir='column' as='main' gap='0'>
      <NavMenu />
      <HeroSection />
      <Box mx={{ base: '2', md: '8', xl: '20' }} my={{ base: '16px', md: '80px' }}>
        <SimpleGrid
          templateColumns={{ base: '1fr', md: '1fr 1fr' }}
          templateRows={{ base: '1fr 1fr' }}
          spacingX='6'
          spacingY={{ base: '2', md: '6' }}
        >
          <GridItem w='100%'>
            <HomePageCard name={BUTTON_LINKS[0].name} link={BUTTON_LINKS[0].link} key={0} />
          </GridItem>
          <GridItem>
            <HomePageCard name={BUTTON_LINKS[1].name} link={BUTTON_LINKS[1].link} key={1} />
          </GridItem>
          <GridItem>
            <HomePageCard name={BUTTON_LINKS[2].name} link={BUTTON_LINKS[2].link} key={2} />
          </GridItem>
          <GridItem>
            <HomePageCard name={BUTTON_LINKS[3].name} link={BUTTON_LINKS[3].link} key={3} />
          </GridItem>
        </SimpleGrid>
      </Box>
      <Footer />
    </Flex>
  )
}

export default LandingPage
