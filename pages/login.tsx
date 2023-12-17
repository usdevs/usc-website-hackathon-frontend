import { Button, Flex, Heading, Input } from '@chakra-ui/react'
import { useState } from 'react'

const LoginPage = () => {
    const [count, setCount] = useState(0)

    function handleClick() {
        setCount(count + 1)
    }

    return (
        <Flex height="100vh" alignItems="center" justifyContent="center">
            <Flex direction="column" background="orange" p={12} rounded={6}>
                <Heading mb={6}>Login</Heading>
                <Input variant="filled" mb={3} type="email"></Input>
                <Input variant="filled" mb={3} type="password"></Input>
                <Button colorScheme="blue">Sign In</Button>
                <Button colorScheme="blue" onClick={handleClick}>Click Me ({count})</Button>
            </Flex>
        </Flex>
    )
}

export default LoginPage