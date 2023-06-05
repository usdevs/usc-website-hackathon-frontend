import { Card, Box, VStack, Heading, Button, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

interface LandingPageBannerProps {
    left: boolean,
    description: string,
    imageUrl: string,
    header: string,
    buttonUrl: string
}



const LandingPageBanner : React.FC<LandingPageBannerProps> = ({left, buttonUrl, description, imageUrl, header}) => {
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
            bgRepeat: 'no-repeat'
        },
        position: 'relative',
        h: '40rem',
        w: '100%',
        
    }

    const cardStyles = {

    }
  return (
    <Box sx={bannerStyles}>
        <VStack h='100%'>
            <Card 
                alignSelf={left ? 'flex-end' : 'flex-start'} 
                flex={1}
                color='white' 
                justifyContent='space-between'
                bg='#1f407b' 
                p='2.5rem 1.5rem 1.5rem 2.5rem' 
                m='2rem' 
                maxW='30rem'
                maxH='30rem'
                borderRadius='5rem'
            >
                <Text>{description}</Text>
                
                <Button
                    as={Link}
                    href={buttonUrl} 
                    color='#1f407b' 
                    bg='white'
                    fontWeight='bold'
                    w='fit-content'
                    rounded='full'
                    p='1.75rem 1rem'
                    fontSize={{ base: '2xl', md: '3xl' }}
                    alignSelf='center'>Find Out More</Button>
            </Card>
            <Heading
                as='h2' 
                position='relative'
                size='3xl'
                textAlign={left ? 'left' : 'right'}
                p='2rem 4rem'
                w='100%'>{header}</Heading>
        </VStack>
        

    </Box>
  )
}

export default LandingPageBanner