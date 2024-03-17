// Stylio
export interface StylioCourse {
  code: string
  name: string
}

export interface StylioProfessor {
  id: number
  name: string
}

export interface CourseOffering {
  id: number
  courseCode: string
  professorId: number
  semester: string
  ay: string
}

export interface StylioStudent {
  id: number
  matriculationNo: string
  name: string
}

export interface StylioSubmission {
  id: number
  title: string
  text: string
  lastUpdated: Date
  isPublished: boolean
  studentId: number
  courseOfferingId: number
}

export interface StylioSubmissionPayload {
  title: string
  text: string
  matriculationNo: string
  courseOfferingInput: {
    courseCode: string
    professorId: number
    semester: string
    academicYear: number
  }
}

export interface StylioDetailedSubmission extends StylioSubmission {
  student: StylioStudent
  courseOffering: CourseOffering & {
    course: StylioCourse
    professor: StylioProfessor
  }
}
