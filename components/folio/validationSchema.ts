import * as Yup from 'yup'

const submissionValidationSchema = Yup.object().shape({
  title: Yup.string().min(1).max(255).required(),
  text: Yup.string().min(1).required(),
  matriculationNo: Yup.string().min(1).max(9).required(),
  courseCode: Yup.string().required(),
  professorId: Yup.number().required(),
  semester: Yup.string().required(),
  academicYear: Yup.number().min(2017).max(2029).required(),
})

export type SubmissionForm = Yup.InferType<typeof submissionValidationSchema>

export default submissionValidationSchema
