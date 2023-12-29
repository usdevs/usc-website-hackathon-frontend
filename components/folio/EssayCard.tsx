import { Card, CardHeader, CardBody, CardFooter, Text, Heading, Image, HStack, VStack } from '@chakra-ui/react'

const EssayCard = () => {
    return (
        <Card>
            <CardHeader>
                <HStack spacing='10px'>
                    <Image
                        borderRadius='full'
                        boxSize='50px'
                        src='https://bit.ly/dan-abramov'
                        alt='Profile Picture'
                    />
                    <VStack>
                        <Heading size='md'>Essay Title</Heading>
                        <Text>Student Name</Text> 
                    </VStack>
                </HStack>
            </CardHeader>
            <CardBody>
                <p>This sentence is the first sentence of the essay that is to be displayed, or it could be snippets of the essay.</p>
            </CardBody>
        </Card>
    );
}

export default EssayCard;