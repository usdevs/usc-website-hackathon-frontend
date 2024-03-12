import { Card, Box, VStack, Heading, Button, Text, Flex, Spacer } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import Image, { StaticImageData } from 'next/image'

interface LandingPageBannerProps {
  left: boolean
  description: string
  imageUrl: string
  header: string
  buttonUrl: string
}

export const LandingPageBanner: React.FC<LandingPageBannerProps> = ({
  left,
  buttonUrl,
  description,
  imageUrl,
  header,
}) => {
  const bannerStyles = {
    _before: {
      content: '""',
      bgImage: `url(${imageUrl})`,
      bgSize: 'cover',
      position: 'absolute',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
      opacity: '0.4',
      bgPosition: 'center',
      bgRepeat: 'no-repeat',
    },
    position: 'relative',
    h: '40rem',
    w: '100%',
  }

  const cardStyles = {
    color: 'white',
    justifyContent: 'space-between',
    bg: '#1f407b',
    p: '2.5rem 1.5rem 1.5rem 2.5rem',
    m: '5rem 4rem 1rem 4rem',
    h: 'fit-content',
    maxW: '30rem',
    borderRadius: '5rem',
  }
  return (
    <Box sx={bannerStyles}>
      <VStack h='100%' justifyContent='space-between'>
        <Flex flex={1} w='100%' maxH='30rem' justifyContent={left ? 'flex-end' : 'flex-start'}>
          <Card {...cardStyles}>
            <Text noOfLines={8} textAlign='center' fontSize={{ base: 'xl', md: '2xl' }}>
              {description}
            </Text>

            <Button
              as={Link}
              href={buttonUrl}
              color='#1f407b'
              bg='white'
              fontWeight='bold'
              w='fit-content'
              rounded='full'
              mt='2rem'
              p='1.75rem 1rem'
              fontSize={{ base: '2xl', md: '3xl' }}
              alignSelf='center'
              _hover={{ bg: '#ff9900', color: 'white' }}
            >
              Find Out More
            </Button>
          </Card>
        </Flex>

        <Heading
          as='h2'
          position='relative'
          size='3xl'
          textAlign={left ? 'left' : 'right'}
          p='2rem 4rem'
          w='100%'
        >
          {header}
        </Heading>
      </VStack>
    </Box>
  )
}

export const MobileLandingPageBanner: React.FC<LandingPageBannerProps> = ({
  left,
  buttonUrl,
  description,
  imageUrl,
  header,
}) => {
  const imageStyle = {}

  return (
    <Flex mt='0px' ml='25px' mr='25px' mb='25px' justifyContent={'center'}>
      <Link href={buttonUrl}>
        <Box as='button' borderRadius='10px' overflow='hidden' bgColor={'white'}>
          <Box>
            <Image src={imageUrl} alt={header} width={800} height={800} style={imageStyle} />
          </Box>

          <Box p='6'>
            <VStack>
              <Text
                as='span'
                color={'#f90'}
                fontFamily={'Domine'}
                fontWeight='bold'
                lineHeight={0.8}
                fontSize='2em'
                textAlign='left'
                width='100%'
              >
                {header}
              </Text>
              <Spacer></Spacer>
              <Text
                noOfLines={8}
                textAlign='left'
                fontSize={{ base: 'xl', md: '2xl' }}
                lineHeight={1.8}
              >
                {description}
              </Text>
            </VStack>
          </Box>
        </Box>
      </Link>
    </Flex>
  )
}
