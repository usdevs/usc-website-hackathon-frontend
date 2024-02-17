import CreateButton from '../../components/folio/CreateButton'
import { Text, Flex, Stack, HStack, VStack, Heading, SimpleGrid } from '@chakra-ui/react'
import ScrollableList from '../../components/folio/ScrollableList'
import EssayCard from '../../components/folio/EssayCard'
import { GetStaticProps, InferGetStaticPropsType } from 'next'

export const getStaticProps: GetStaticProps<{
  submissions: FolioDetailedSubmission[]
}> = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'submissions/all')
  const submissions = await res.json()
  return { props: { submissions } }
}

export default function Page({ submissions }: InferGetStaticPropsType<typeof getStaticProps>) {
  const codes = ['NTW', 'NGN', 'NSW', 'GEA', 'NGT', 'NSS', 'CPS', 'NST', 'NHS']
  const numbers = ['2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009']

  return (
    <Stack direction='row' spacing={8} p={8}>
      <VStack align='stretch'>
        <HStack>
          <ScrollableList title='Module Code' items={codes} />
          <ScrollableList title='Module Number' items={numbers} />
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
