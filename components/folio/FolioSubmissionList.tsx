import { Flex, VStack, Heading, SimpleGrid, useToast } from '@chakra-ui/react'
import FolioSubmissionCard from '../../components/folio/FolioSubmissionCard'
import { useUserInfo } from '../../hooks/useUserInfo'
import { useRouter } from 'next/router'
import { makeFetchToUrlWithAuth } from '../../utils'
import { notLoggedInToast } from '../toasts/common'
import { makeErrorToast, makeSuccessToast } from '../../utils/orgUtils'

type Props = {
  submissions: FolioDetailedSubmission[]
}

export default function FolioSubmissionList({ submissions }: Props) {
  const [auth] = useUserInfo()
  const toast = useToast()
  const router = useRouter()

  async function handleDelete(id: number) {
    if (!auth) {
      toast(notLoggedInToast)
      return
    }

    try {
      await makeFetchToUrlWithAuth(
        process.env.NEXT_PUBLIC_BACKEND_URL + 'folio/submissions/' + id,
        auth.token,
        'DELETE',
        JSON.stringify({}),
      )
      toast(makeSuccessToast('Submission deleted successfully'))
      router.reload()
    } catch (err) {
      toast(makeErrorToast('Error deleting submission', JSON.stringify((err as Error).message)))
    }
  }

  return (
    <VStack w='100%'>
      <Heading size='xl'>Folio Submissions</Heading>
      <SimpleGrid columns={2} spacing={8} p={8} w='100%'>
        {submissions.map((submission) => (
          <FolioSubmissionCard
            key={submission.id}
            submission={submission}
            onDelete={() => handleDelete(submission.id)}
          />
        ))}
      </SimpleGrid>
    </VStack>
  )
}
