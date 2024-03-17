'use client'

import { Heading, useToast } from '@chakra-ui/react'
import { VStack } from '@chakra-ui/react'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'

import { makeFetchToUrlWithAuth } from '@/utils/booking'
import { makeErrorToast, makeSuccessToast } from '@/utils/orgUtils'

import {
  StylioCourse,
  StylioProfessor,
  StylioStudent,
  StylioSubmissionPayload,
} from '@/types/stylio.types'

import { useUserInfo } from '@/hooks/useUserInfo'

import CreateSubmissionForm from '@/components/stylio/CreateSubmissionForm'
import { SubmissionForm } from '@/components/stylio/validationSchema'
import { notLoggedInToast } from '@/components/toasts/common'

export const getStaticProps: GetStaticProps<{
  courses: StylioCourse[]
  professors: StylioProfessor[]
  students: StylioStudent[]
}> = async () => {
  const [courses, professors, students] = await Promise.all([
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'stylio/courses/all').then((res) => res.json()),
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'stylio/professors/all').then((res) => res.json()),
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'stylio/students/all').then((res) => res.json()),
  ])
  return { props: { courses, professors, students } }
}

export default function StylioSubmissionForm({
  courses,
  professors,
  students,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [auth] = useUserInfo()
  const toast = useToast()

  const semesters = ['Semester 1', 'Semester 2']
  const academicYears = [2018, 2019, 2020, 2021, 2022, 2023, 2024]

  const router = useRouter()
  async function onSubmit(values: SubmissionForm) {
    if (!auth) {
      toast(notLoggedInToast)
      return
    }

    const { title, text, professorId, courseCode, matriculationNo, semester, academicYear } = values
    const submissionPayload: StylioSubmissionPayload = {
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

    const postUrl = process.env.NEXT_PUBLIC_BACKEND_URL + 'stylio/submissions'

    try {
      const { responseJson: data } = await makeFetchToUrlWithAuth(
        postUrl,
        auth.token,
        'POST',
        JSON.stringify(submissionPayload),
      )
      const id = data?.result?.[0]?.id
      toast(makeSuccessToast('Submission created successfully! Redirecting...'))

      await new Promise((resolve) => setTimeout(resolve, 1000))
      if (!id) {
        router.push('/stylio')
      } else {
        router.push('/stylio/' + id)
      }
    } catch (err) {
      toast(makeErrorToast('Error creating submission', JSON.stringify((err as Error).message)))
    }
  }

  return (
    <>
      <VStack spacing='25px' py={8} mb={16}>
        <Heading size='xl'>Create New Stylio Post</Heading>
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
