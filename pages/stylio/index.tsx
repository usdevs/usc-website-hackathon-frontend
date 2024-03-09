import CreateButton from '../../components/stylio/CreateButton'
import { HStack, VStack, SimpleGrid } from '@chakra-ui/react'
import ScrollableList from '../../components/stylio/ScrollableList'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import StylioSubmissionList from '../../components/stylio/StylioSubmissionList'
import OpenHouse from '../../pages/stylio/open-house'

export const getStaticProps: GetStaticProps<{
  submissions: StylioDetailedSubmission[]
  courses: StylioCourse[]
}> = async () => {
  const [submissions, courses] = await Promise.all([
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'stylio/submissions/all').then((res) => res.json()),
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'stylio/courses/all').then((res) => res.json()),
  ])
  return { props: { submissions, courses } }
}

export default function Page({
  submissions,
  courses,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  // TODO: remove after open house
  if (submissions.length === 0) {
    return <OpenHouse />
  }

  const codes = courses.map((course) => course.code)
  const semesters = ['Sem 1', 'Sem 2']
  const years = [2021, 2022, 2023]
  const aySemesters = years.flatMap((year) => {
    const yearLastTwoDigits = parseInt(year.toString().slice(2))
    return semesters.map(
      (semester) => `AY${yearLastTwoDigits}/${yearLastTwoDigits + 1} ${semester}`,
    )
  })

  return (
    <SimpleGrid
      gridTemplateColumns={{ base: '1fr', lg: '1fr 3fr', xl: '1fr 4fr' }}
      rowGap={8}
      justifyItems={'center'}
      p={{ base: 2, md: 4, lg: 8 }}
      pt={{ base: 4, md: 6, lg: 12 }}
      minH={'70vh'}
    >
      <VStack align='stretch'>
        <HStack w='100%'>
          <ScrollableList title='Module Code' items={codes} />
          <ScrollableList title='Year' items={aySemesters} />
        </HStack>
        <CreateButton href='/stylio/create-submission' />
      </VStack>
      <StylioSubmissionList submissions={submissions} />
    </SimpleGrid>
  )
}
