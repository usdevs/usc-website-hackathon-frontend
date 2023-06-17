import { createContext } from 'react'

export type BookingsContextValue = {
  allOrgs: Organisation[]
  allVenues: Venue[]
  allIGCategories: object | null
}

export const BookingsContext = createContext<BookingsContextValue>({
  allOrgs: [],
  allVenues: [],
  allIGCategories: null
})
