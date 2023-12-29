import { Card, CardHeader, CardBody, CardFooter, Text, Heading, Image } from '@chakra-ui/react'

const EssayCard = () => {
    return (
        <Card>
            <CardHeader>
                <Image
                    borderRadius='full'
                    boxSize='150px'
                    src='https://bit.ly/dan-abramov'
                    alt='Dan Abramov'
                />
                <Heading size='md'>Essay Title</Heading>
                <Text>Student Name</Text>
            </CardHeader>
            <CardBody>
                <p>Lorem ipsum</p>
            </CardBody>
            <CardFooter>Date</CardFooter>
        </Card>
    );
}

export default EssayCard;