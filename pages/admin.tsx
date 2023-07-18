import type { NextPage } from 'next'
import { Button, Flex } from '@chakra-ui/react'
import Footer from '../components/Footer'
import { isUserLoggedIn } from '../utils'
import { useUserInfo } from '../hooks/useUserInfo'

const AdminPage: NextPage = () => {
  const [auth] = useUserInfo()

  return (
    <Flex justify='center' flexDir='column' as='main'>
      <Button
        size='sm'
        variant='outline'
        _hover={{ transform: 'scale(1.2)' }}
        _active={{ transform: 'scale(0.9)' }}
        onClick={() => {
          if (isUserLoggedIn(auth)) {
            console.log(auth?.token)
          } else {
            console.log('Log in first!')
          }
        }}
      >
        Get it
      </Button>
      <Footer />
    </Flex>
  )
}

export default AdminPage
