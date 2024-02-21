import CreateButton from '../../components/folio/CreateButton'
import { Text, Flex, Stack, HStack, VStack, Heading, SimpleGrid } from '@chakra-ui/react'
import ScrollableList from '../../components/folio/ScrollableList'
import EssayCard from '../../components/folio/EssayCard'
import { GetStaticProps, InferGetStaticPropsType } from 'next'

export const getStaticProps: GetStaticProps<{
  submissions: FolioDetailedSubmission[]
  courses: FolioCourse[]
}> = async () => {
  const [submissions, courses] = await Promise.all([
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'folio/submissions/all').then((res) => res.json()),
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'folio/courses/all').then((res) => res.json()),
  ])
  console.log(courses)
  return { props: { submissions, courses } }
}

export default function Page({
  submissions,
  courses,
}: InferGetStaticPropsType<typeof getStaticProps>) {
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
    <Stack direction='row' spacing={8} p={8}>
      <VStack align='stretch'>
        <HStack>
          <ScrollableList title='Module Code' items={codes} />
          <ScrollableList title='Year' items={aySemesters} />
        </HStack>
        <CreateButton href='/folio/create-submission' />
      </VStack>
      <Flex justify='center' flexGrow={1} p={8}>
        <VStack>
          <Heading size='md'>NTW2001: Cosmopolitanism and Global Citizenship</Heading>
          <Text>Instructor: Dr Leung Wing Sze</Text>
          <SimpleGrid
            columns={2}
            spacing={8}
            p={8}
            maxH='100vh'
            overflow='auto'
            sx={{
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'gray.200',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'blue.500',
                borderRadius: '24px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: 'blue.600',
              },
            }}
          >
            {submissions.map((submission) => (
              <EssayCard key={submission.id} submission={submission} />
            ))}
          </SimpleGrid>
        </VStack>
      </Flex>
    </Stack>
  )
}
