'use client'
import { ChakraProvider } from '@chakra-ui/react'
import { Button, Heading } from '@chakra-ui/react'
import { VStack } from '@chakra-ui/react'
import Footer from '../../components/Footer'
import SelectCard from '../../components/folioform/SelectCard'
import ShortAnswerCard from '../../components/folioform/ShortAnswerCard'
import LongAnswerCard from '../../components/folioform/LongAnswerCard'
import { GetStaticProps, InferGetStaticPropsType } from 'next'

export const getStaticProps: GetStaticProps<{
  courses: FolioCourse[]
  professors: FolioProfessor[]
  students: FolioStudent[]
}> = async () => {
  const [courses, professors, students] = await Promise.all([
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'folio/courses/all').then((res) => res.json()),
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'folio/professors/all').then((res) => res.json()),
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'folio/students/all').then((res) => res.json()),
  ])
  console.log(courses)
  return { props: { courses, professors, students } }
}

export default function FolioSubmissionForm({
  courses,
  professors,
  students,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const courseCodes = courses.map((course) => course.code)
  const professorNames = professors.map((professor) => professor.name)

  return (
    <ChakraProvider>
      <VStack spacing='25px' mb={8}>
        <Heading size='md' mt={4}>
          Create New Entry
        </Heading>
        <SelectCard label='Module Code' optionName='Module' options={courseCodes} />{' '}
        <SelectCard label='Instructor' optionName='Instructor' options={professorNames} />{' '}
        <SelectCard
          label='Academic Year'
          optionName='Academic Year'
          options={['2018', '2019', '2020', '2021', '2022', '2023']}
        />{' '}
        <SelectCard label='Semester' optionName='Semester' options={['Semester 1', 'Semester 2']} />{' '}
        <ShortAnswerCard label='Student Name' prompt="Enter Student's name" />
        <ShortAnswerCard label='Title' prompt='Enter ' />
        <LongAnswerCard label='Content' prompt='Enter Content' />
        <Button colorScheme='blue' size='lg' mt={4} onClick={() => console.log('Submitted')}>
          Submit
        </Button>
      </VStack>
      <Footer />
    </ChakraProvider>
  )
}
