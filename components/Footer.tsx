import { Heading, VStack, Link, Flex, Icon } from '@chakra-ui/react'
import FooterMap from './FooterMap';
import { FaInstagram, FaTelegram } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const linkStyles = {
  pl : 7,
  display: 'flex',
  alignItems: 'center'
}

const iconStyles = {
  mr : 1,
  fontSize: '1.1rem'
}

const Footer = () => {
  return (
  <VStack pt="1.5rem" pb="1rem" bg='#1f407b' color='white' justifyContent='space-between'>
      <Flex w='100%' justify='space-around'>
        <VStack alignItems='flex-start'>
          <Heading as="h4" size="md">Navigate</Heading>
          <Link sx={linkStyles} href='/'>About Us</Link>
          <Link sx={linkStyles} href='/interest-groups'>Interest Groups</Link>
          <Link sx={linkStyles} href='/bookings'>Bookings</Link>
          <Link sx={linkStyles} href='/'>Events</Link>
          <Link sx={linkStyles} href='/'>Admins</Link>
        </VStack>
        <VStack alignItems='flex-start'>
          <Heading as="h4" size="md">For more updates, follow us on:</Heading>
          <Link sx={linkStyles} href='https://www.instagram.com/nus.usc/'>
            <Icon sx={iconStyles} as={FaInstagram} />
            Instagram
          </Link>
          <Link sx={linkStyles} href='https://t.me/USPChannel'>
            <Icon sx={iconStyles} as={FaTelegram} />
            Telegram
          </Link>
          <Link sx={linkStyles} href='mailto: usc.hongensec@u.nus.edu'>
            <Icon sx={iconStyles} as={MdEmail} />
            Email
          </Link>
        </VStack>
        <VStack alignItems='flex-start' position='relative' w='23rem' h="12rem">
          <Heading as="h4" size="md">Locate us:</Heading>
          <FooterMap />
        </VStack>
      </Flex>
      <Heading as='h5' size='sm' pt='3rem' fontWeight="normal">Copyright @ 2023 NUS College Cinnamon Student Life</Heading>
      
    </VStack>
  );
}

export default Footer
