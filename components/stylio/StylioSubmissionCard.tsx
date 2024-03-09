import { DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons'
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Heading,
  VStack,
  IconButton,
} from '@chakra-ui/react'
import Link from 'next/link'

type Props = {
  submission: StylioDetailedSubmission
  onDelete: () => Promise<void>
}

const StylioSubmissionCard = ({ submission, onDelete }: Props) => {
  const { title, text } = submission
  const { name: studentName } = submission.student

  return (
    <Card>
      <CardHeader>
        <VStack align='left' gap='2'>
          <Heading size='md' noOfLines={2}>
            {title}
          </Heading>
          <Text fontSize='md'>{studentName}</Text>
        </VStack>
      </CardHeader>
      <CardBody py={0}>
        <Text noOfLines={3}>{text}</Text>
      </CardBody>
      <CardFooter gap='5px'>
        <Link href={`/stylio/${submission.id}`}>
          <IconButton variant='outline' aria-label='View Essay' icon={<ViewIcon />} />
        </Link>
        <IconButton variant='outline' aria-label='Edit Essay' icon={<EditIcon />} />
        <IconButton
          variant='outline'
          aria-label='Delete Essay'
          icon={<DeleteIcon />}
          onClick={onDelete}
        />
      </CardFooter>
    </Card>
  )
}

export default StylioSubmissionCard
