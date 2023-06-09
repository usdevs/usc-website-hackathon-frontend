import { Heading, VStack, Link, Flex, Icon } from '@chakra-ui/react'
import VenueMap from "./VenueMap";
import { FaInstagram, FaTelegram } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import React from "react";

interface SocialLink extends NavigationLink {
  iconComponent: React.FC,
}

const navigationLinks : NavigationLink[] = [
  {
    href: '/',
    label: 'About Us'
  },
  {
    href: '/student-groups',
    label: 'Student Groups'
  },
  {
    href: '/bookings',
    label: 'Bookings'
  },
  {
    href: '/',
    label: 'Events'
  },
  {
    href: '/',
    label: 'Admins'
  }
]

const socialLinks : SocialLink[] = [
  {
    href: 'https://www.instagram.com/nus.usc/',
    iconComponent: FaInstagram,
    label: 'Instagram'
  },
  {
    href: 'https://t.me/USPChannel',
    iconComponent: FaTelegram,
    label: 'Telegram'
  },
  {
    href: 'mailto: usc.hongensec@u.nus.edu',
    iconComponent: MdEmail,
    label: 'Email'
  }
]

const linkStyles = {
  pl : 7,
  display: 'flex',
  alignItems: 'center'
}

const iconStyles = {
  mr : 1,
  fontSize: '1.1rem'
}

const Footer : React.FC = () => {
  return (
  <VStack pt="1.5rem" pb="1rem" bg='#1f407b' color='white' justifyContent='space-between'>
      <Flex w='100%' justify='space-around'>
        <VStack alignItems='flex-start'>
          <Heading as="h4" size="md">Navigate</Heading>
          { navigationLinks.map(({href, label}) => <Link key={label} sx={linkStyles} href={href}>{label}</Link>) }
        </VStack>
        <VStack alignItems='flex-start'>
          <Heading as="h4" size="md">For more updates, follow us on:</Heading>
          {
            socialLinks.map(({href, iconComponent, label}) =>
              <Link key = {label} sx={linkStyles} href={href}>
                <Icon sx={iconStyles} as={iconComponent} />
                {label}
              </Link>
          )}
        </VStack>
        <VStack alignItems='flex-start' position='relative' w='23rem' h="12rem">
          <Heading as="h4" size="md">Locate us:</Heading>
          <VenueMap/>
        </VStack>
      </Flex>
      <Heading as='h5' size='sm' pt='3rem' fontWeight="normal">Copyright © 2023 NUS College Cinnamon Student Life</Heading>
    </VStack>
  );
}

export default Footer
