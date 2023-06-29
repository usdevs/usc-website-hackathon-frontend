import { createContext } from 'react'

export type BookingsContextValue = {
  allOrgs: Organisation[]
  allVenues: Venue[]
}

export const BookingsContext = createContext<BookingsContextValue>({
  allOrgs: [],
  allVenues: [],
})
