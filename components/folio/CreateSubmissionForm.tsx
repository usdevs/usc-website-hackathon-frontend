import { Button, VStack } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import FormTextField from '../form/FormTextField'
import FormSelect from '../form/FormSelect'
import FormTextArea from '../form/FormTextArea'
import submissionValidationSchema, { SubmissionForm } from './validationSchema'

type Props = {
  professors: FolioProfessor[]
  courses: FolioCourse[]
  students: FolioStudent[]
  semesters: string[]
  academicYears: number[]
  onSubmit: (values: SubmissionForm) => void
}

export default function CreateSubmissionForm({
  professors,
  courses,
  students,
  semesters,
  academicYears,
  onSubmit,
}: Props) {
  const professorOptions = professors.map((professor) => ({
    value: professor.id,
    label: professor.name,
  }))
  const courseOptions = courses.map((course) => ({
    value: course.code,
    label: `${course.code} - ${course.name}`,
  }))
  const studentOptions = students.map((student) => ({
    value: student.matriculationNo,
    label: student.name,
  }))
  const semesterOptions = semesters.map((semester) => ({
    value: semester,
    label: semester,
  }))
  const academicYearOptions = academicYears.map((year) => ({
    value: year,
    label: `AY ${year}/${year + 1}`,
  }))

  const initialValues = {
    title: '',
    text: '',
    professorId: professors[0].id,
    courseCode: courses[0].code,
    matriculationNo: studentOptions[0].value,
    semester: semesters[0],
    academicYear: 2022,
  }

  async function handleSubmit(values: SubmissionForm) {
    // Form option values are strings, but the backend expects numbers for academicYear
    const { academicYear } = values
    const transformedValues = { ...values, academicYear: Number(academicYear) }
    onSubmit(transformedValues)
  }

  return (
    <Formik
      validationSchema={submissionValidationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {(form) => {
        return (
          <Form>
            <VStack align='start' spacing={4} w='2xl'>
              <FormSelect
                id='courseCode'
                name='courseCode'
                label='Course'
                defaultValue={courses[0].code}
                placeholder={'Select a course...'}
                data={courseOptions}
                field={form.getFieldProps('course')}
                form={form}
              />

              <FormSelect
                id='professorId'
                name='professorId'
                label='Professor'
                defaultValue={professors[0].id}
                placeholder={'Select a professor...'}
                data={professorOptions}
                field={form.getFieldProps('professor')}
                form={form}
              />

              <FormSelect
                id='matriculationNo'
                name='matriculationNo'
                label='Student'
                defaultValue={students[0].matriculationNo}
                placeholder={'Select a student...'}
                data={studentOptions}
                field={form.getFieldProps('student')}
                form={form}
              />

              <FormSelect
                id='semester'
                name='semester'
                label='Semester'
                defaultValue={semesters[0]}
                placeholder={'Select a semester...'}
                data={semesterOptions}
                field={form.getFieldProps('semester')}
                form={form}
              />

              <FormSelect
                id='academicYear'
                name='academicYear'
                label='Academic Year'
                defaultValue={academicYears[0]}
                placeholder={'Select an academic year...'}
                data={academicYearOptions}
                field={form.getFieldProps('academicYear')}
                form={form}
              />

              <FormTextField
                type='text'
                id='title'
                name='title'
                label='Title'
                field={form.getFieldProps('title')}
                form={form}
              />
              <FormTextArea
                id='text'
                name='text'
                label='Text'
                field={form.getFieldProps('text')}
                form={form}
                minHeight={200}
              />

              <Button type='submit' colorScheme='teal' mt={4} isLoading={form.isSubmitting}>
                Submit
              </Button>
            </VStack>
          </Form>
        )
      }}
    </Formik>
  )
}
