import { createContext } from 'react';

export type BookingsContextValue = {
  allOrgs: OrgInfo[];
};

export const BookingsContext = createContext<BookingsContextValue>({
  allOrgs: [],
});
