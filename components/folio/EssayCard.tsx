import { DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
import { Card, CardHeader, CardBody, CardFooter, Text, Heading, Avatar, HStack, VStack, IconButton } from '@chakra-ui/react'

const EssayCard = () => {
    return (
        <Card>
            <CardHeader>
                <HStack spacing='10px'>
                    <Avatar src='https://bit.ly/broken-link' />
                    <VStack>
                        <Heading size='md'>Essay Title</Heading>
                        <Text>Student Name</Text> 
                    </VStack>
                </HStack>
            </CardHeader>
            <CardBody>
                <p>This sentence is the first sentence of the essay that is to be displayed, or it could be snippets of the essay.</p>
            </CardBody>
            <CardFooter gap='5px'>
                <IconButton
                    variant='outline'
                    aria-label='View Essay'
                    icon={<ViewIcon />} 
                />
                <IconButton
                    variant='outline'
                    aria-label='Edit Essay'
                    icon={<EditIcon />} 
                />
                <IconButton
                    variant='outline'
                    aria-label='Delete Essay'
                    icon={<DeleteIcon />} 
                />
            </CardFooter>
        </Card>
    );
}

export default EssayCard;