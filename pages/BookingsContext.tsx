import { createContext } from 'react';

export type BookingsContextValue = {
  allBookings: BookingDataBackend[];
  allOrgs: OrgInfo[];
};

export const BookingsContext = createContext<BookingsContextValue>({
  allBookings: [],
  allOrgs: [],
});
