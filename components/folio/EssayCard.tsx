import { DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons'
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Heading,
  Avatar,
  HStack,
  VStack,
  IconButton,
} from '@chakra-ui/react'

const EssayCard = () => {
  return (
    <Card>
      <CardHeader>
        <HStack spacing='10px'>
          <Avatar src='https://bit.ly/broken-link' />
          <VStack align='left'>
            <Heading size='sm'>Essay Title</Heading>
            <Text fontSize='sm'>Student Name</Text>
          </VStack>
        </HStack>
      </CardHeader>
      <CardBody>
        <Text noOfLines={3}>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer
          took a galley of type and scrambled it to make a type specimen book. It has survived not
          only five centuries, but also the leap into electronic typesetting, remaining essentially
          unchanged. It was popularised in the 1960s with the release of Letraset sheets containing
          Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
          PageMaker including versions of Lorem Ipsum. It is a long established fact that a reader
          will be distracted by the readable content of a page when looking at its layout. The point
          of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as
          opposed to using &apos;Content here, content here&apos;, making it look like readable
          English. Many desktop publishing packages and web page editors now use Lorem Ipsum as
          their default model text, and a search for &apos;lorem ipsum&apos; will uncover many web
          sites still in their infancy. Various versions have evolved over the years, sometimes by
          accident, sometimes on purpose (injected humour and the like).
        </Text>
      </CardBody>
      <CardFooter gap='5px'>
        <IconButton variant='outline' aria-label='View Essay' icon={<ViewIcon />} />
        <IconButton variant='outline' aria-label='Edit Essay' icon={<EditIcon />} />
        <IconButton variant='outline' aria-label='Delete Essay' icon={<DeleteIcon />} />
      </CardFooter>
    </Card>
  )
}

export default EssayCard
