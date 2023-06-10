import { createContext } from 'react'

export type BookingsContextValue = {
  allOrgs: Organisation[]
}

export const BookingsContext = createContext<BookingsContextValue>({
  allOrgs: [],
})
