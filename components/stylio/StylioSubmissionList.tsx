import { Heading, SimpleGrid, VStack, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { makeFetchToUrlWithAuth } from '@/utils/booking'
import { makeErrorToast, makeSuccessToast } from '@/utils/orgUtils'

import { StylioDetailedSubmission } from '@/types/stylio.types'

import { useUserInfo } from '@/hooks/useUserInfo'

import StylioSubmissionCard from '@/components/stylio/StylioSubmissionCard'
import { notLoggedInToast } from '@/components/toasts/common'

type Props = {
  submissions: StylioDetailedSubmission[]
}

export default function StylioSubmissionList({ submissions }: Props) {
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
        process.env.NEXT_PUBLIC_BACKEND_URL + 'stylio/submissions/' + id,
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
      <Heading size='xl'>Stylio Submissions</Heading>
      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={8} p={8} w='100%'>
        {submissions.map((submission) => (
          <StylioSubmissionCard
            key={submission.id}
            submission={submission}
            onDelete={() => handleDelete(submission.id)}
          />
        ))}
      </SimpleGrid>
    </VStack>
  )
}
