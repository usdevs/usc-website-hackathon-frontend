// import { Heading, VStack, Link, Flex, Icon } from '@chakra-ui/react'
import { Heading, Grid, GridItem, VStack, Link, Flex, Icon } from '@chakra-ui/react'
import VenueMap from './VenueMap'
import { FaInstagram, FaTelegram } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import React from 'react'
import { BUTTON_LINKS } from '../utils'

interface SocialLink extends NavigationLink {
  iconComponent: React.FC
}

const navigationLinks: NavigationLink[] = [
  {
    href: '/',
    label: 'Home',
  },
  ...BUTTON_LINKS,
]

const socialLinks: SocialLink[] = [
  {
    href: 'https://www.instagram.com/nus.nuscc/',
    iconComponent: FaInstagram,
    label: 'Instagram',
  },
  {
    href: 'https://t.me/USPChannel',
    iconComponent: FaTelegram,
    label: 'Telegram',
  },
  {
    href: 'mailto: usc.hongensec@u.nus.edu',
    iconComponent: MdEmail,
    label: 'Email',
  },
]

const linkStyles = {
  // pl: 7,
  display: 'flex',
  alignItems: 'center',
}

const iconStyles = {
  mr: 1,
  fontSize: '1.1rem',
}

// const Footer: React.FC = () => {
//   return (
//     // <VStack pt='1.5rem' pb='1rem' bg='#1f407b' color='white' justifyContent='space-between'>
//       <Flex w='100%' justify='space-around'>
//         <VStack alignItems='flex-start'>
//           <Heading as='h4' size='md'>
//             Navigate
//           </Heading>
//           {navigationLinks.map(({ href, label }) => (
//             <Link key={label} sx={linkStyles} href={href}>
//               {label}
//             </Link>
//           ))}
//         </VStack>
//         <VStack alignItems='flex-start'>
//           <Heading as='h4' size='md'>
//             For more updates, follow us on:
//           </Heading>
//           {socialLinks.map(({ href, iconComponent, label }) => (
//             <Link key={label} sx={linkStyles} href={href}>
//               <Icon sx={iconStyles} as={iconComponent} />
//               {label}
//             </Link>
//           ))}
//         </VStack>
//         <VStack alignItems='flex-start' position='relative' w='23rem' h='12rem'>
//           <Heading as='h4' size='md'>
//             Locate us:
//           </Heading>
//           <VenueMap />
//         </VStack>
//       </Flex>
//       <Heading as='h5' size='sm' pt='3rem' fontWeight='normal'>
//         Copyright © 2023 NUS College Cinnamon Student Life
//       </Heading>
//     {/* </VStack> */}
//   )
// }

const Footer: React.FC = () => {
  return (
    <VStack p='1.5rem 1rem' bg='#1f407b' color='white' justifyContent='space-between'>
      <Grid
        gap={6}
        templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}
        justifyContent='center'
      >
        <GridItem justifyContent='center' px='1rem'>
          <Heading as='h4' size='md'>
            Navigate
          </Heading>
          {navigationLinks.map(({ href, label }) => (
            <Link key={label} sx={linkStyles} href={href}>
              {label}
            </Link>
          ))}
        </GridItem>
        <GridItem justifyContent='center' px='1rem'>
          <VStack alignItems='flex-start'>
            <Heading as='h4' size='md'>
              For more updates, follow us on:
            </Heading>
            {socialLinks.map(({ href, iconComponent, label }) => (
              <Link key={label} sx={linkStyles} href={href}>
                <Icon sx={iconStyles} as={iconComponent} />
                {label}
              </Link>
            ))}
          </VStack>
        </GridItem>
        <GridItem justifyContent='center' px='1rem' minH='20vh'>
          <VStack alignItems='flex-start' position='relative' h='100%'>
            <Heading as='h4' size='md'>
              Locate us:
            </Heading>
            <VenueMap />
          </VStack>
        </GridItem>
      </Grid>
      <Flex justifyContent='center' alignContent='center' textAlign='center' px='1rem'>
        <Heading as='h5' size='sm' pt='1rem' fontWeight='normal'>
          Copyright © 2023 NUS College Cinnamon Student Life
        </Heading>
      </Flex>
    </VStack>
  )
}

export default Footer
