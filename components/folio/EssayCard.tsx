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
import Link from 'next/link'

type Props = {
  submission: FolioDetailedSubmission
}

const EssayCard = ({ submission }: Props) => {
  const { title, text, lastUpdated } = submission
  const { name: studentName } = submission.student

  return (
    <Card>
      <CardHeader>
        <HStack spacing='10px'>
          <Avatar src='https://bit.ly/broken-link' />
          <VStack align='left'>
            <Heading size='sm'>{title}</Heading>
            <Text fontSize='sm'>{studentName}</Text>
          </VStack>
        </HStack>
      </CardHeader>
      <CardBody>
        <Text noOfLines={3}>{text}</Text>
      </CardBody>
      <CardFooter gap='5px'>
        <Link href={`/folio/${submission.id}`}>
          <IconButton variant='outline' aria-label='View Essay' icon={<ViewIcon />} />
        </Link>
        <IconButton variant='outline' aria-label='Edit Essay' icon={<EditIcon />} />
        <IconButton variant='outline' aria-label='Delete Essay' icon={<DeleteIcon />} />
      </CardFooter>
    </Card>
  )
}

export default EssayCard
