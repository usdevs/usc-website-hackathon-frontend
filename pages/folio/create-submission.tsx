'use client'
import { Heading, UseToastOptions, useToast } from '@chakra-ui/react'
import { VStack } from '@chakra-ui/react'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import CreateSubmissionForm from '../../components/folio/CreateSubmissionForm'
import { SubmissionForm } from '../../components/folio/validationSchema'
import { useUserInfo, useUserInfoNonNull } from '../../hooks/useUserInfo'
import { makeErrorToast, makeSuccessToast } from '../../utils/orgUtils'
import { makeFetchToUrlWithAuth } from '../../utils'

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
  return { props: { courses, professors, students } }
}

const errorToast = {
  title: 'Error',
  description: 'You must be logged in to create a submission',
  status: 'error',
  duration: 5000,
  isClosable: true,
} satisfies UseToastOptions

export default function FolioSubmissionForm({
  courses,
  professors,
  students,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [auth] = useUserInfo()
  const toast = useToast()

  const semesters = ['Semester 1', 'Semester 2']
  const academicYears = [2018, 2019, 2020, 2021, 2022, 2023, 2024]

  async function onSubmit(values: SubmissionForm) {
    if (!auth) {
      toast(errorToast)
      return
    }

    const { title, text, professorId, courseCode, matriculationNo, semester, academicYear } = values
    const submissionPayload: FolioSubmissionPayload = {
      title,
      text,
      matriculationNo,
      courseOfferingInput: {
        courseCode,
        professorId,
        semester: semester.replaceAll(/ /g, ''),
        academicYear,
      },
    }

    const postUrl = process.env.NEXT_PUBLIC_BACKEND_URL + 'folio/submissions'

    try {
      await makeFetchToUrlWithAuth(postUrl, auth.token, 'POST', JSON.stringify(submissionPayload))
      toast(makeSuccessToast('Submission created successfully!'))
    } catch (err) {
      toast(makeErrorToast('Error creating submission', JSON.stringify((err as Error).message)))
    }
  }

  return (
    <>
      <VStack spacing='25px' py={8} mb={16}>
        <Heading size='xl'>Create New Folio Post</Heading>
        <CreateSubmissionForm
          professors={professors}
          courses={courses}
          students={students}
          semesters={semesters}
          academicYears={academicYears}
          onSubmit={onSubmit}
        />
      </VStack>
    </>
  )
}
