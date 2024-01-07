import type { NextPage } from 'next'
import { Flex, Box, Stack, Text, useBreakpointValue, VStack, useMediaQuery } from '@chakra-ui/react'
import Footer from '../components/Footer'
import HeroBg from '../public/image1.jpg'
import Image from 'next/image'
import { LandingPageBanner, MobileLandingPageBanner } from '../components/LandingPageBanner'
import landingPageMockData from '../constants/LandingPageMockData'

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
      <VStack w={'full'} justify={'center'} px={useBreakpointValue({ base: 4, md: 8 })}>
        <Stack align={'flex-start'}>
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
    // </Flex>
  )
}

const MobileHeroSection = () => {
  return (
    <Flex m='25px' justifyContent={'center'}>
      <Box borderRadius='10px' overflow='hidden' bgColor={'white'}>
        <Image alt='Mountains' src={HeroBg} placeholder='blur' quality={100} sizes='100vw' />

        <Box p='6'>
          <Flex justifyContent={'center'}>
            <Text
              as='span'
              color={'#f90'}
              fontFamily={'Domine'}
              fontWeight='bold'
              lineHeight={0.8}
              fontSize='2em'
            >
              Cinnamon&nbsp;
            </Text>
            <Text
              as='span'
              color={'black'}
              fontFamily={'Domine'}
              fontWeight='bold'
              lineHeight={0.8}
              fontSize='2em'
            >
              Student Life
            </Text>
          </Flex>
        </Box>
      </Box>
    </Flex>
  )
}

const LandingPage: NextPage = () => {
  const landingPageData = landingPageMockData
  const [isMobile] = useMediaQuery('(max-width: 768px)')

  if (isMobile) {
    return (
      <Flex bgColor='#f5f5f5' justify='center' flexDir='column' as='main' gap='0'>
        <MobileHeroSection />

        <Box>
          {landingPageData.map((data, index) => (
            <MobileLandingPageBanner key={index} left={index % 2 == 1} {...data} />
          ))}
        </Box>

        <Footer />
      </Flex>
    )
  }

  return (
    <Flex justify='center' flexDir='column' as='main' gap='0'>
      <HeroSection />
      <Box>
        {landingPageData.map((data, index) => (
          <LandingPageBanner key={index} left={index % 2 == 1} {...data} />
        ))}
      </Box>
    </Flex>
  )
}

export default LandingPage
