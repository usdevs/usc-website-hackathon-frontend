import { createContext } from 'react'

export type StudentGroupContextValue = {
  allOrgs: OrganisationWithIGHead[]
  allIGCategories: object | null
}

export const StudentGroupsContext = createContext<StudentGroupContextValue>({
  allOrgs: [],
  allIGCategories: null,
})
