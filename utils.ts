import { useGlobalState } from './components/swr-internal-state-main'

export const useBookingCellStyles = () => useGlobalState<number>('root-font-size', 16)

export const ALL_VENUES_KEYWORD: Venue = { id: 0, name: 'All Venues' }

export const isUserLoggedIn = (auth: AuthState | null): boolean => {
  return auth !== null
}
export const BUTTON_LINKS: NavigationLink[] = [
  {
    label: 'Student Groups',
    href: '/student-groups',
  },
  {
    label: 'Bookings',
    href: '/bookings',
  },
]

export const BOOKING_CELL_BORDER_Y_REM = 0.2

export const BOOKING_CELL_HEIGHT_REM = 2 // Ensures time labels are aligned with grid cells

export const DEFAULT_PNG_NAME = 'default.png'

export const throwsErrorIfNullOrUndefined = <T>(
  argument: T | undefined | null,
  message: string = 'This value was promised to be there.',
): T => {
  if (argument === undefined || argument === null) {
    throw new TypeError(message)
  }
  return argument
}

export const getOrgFromId = (orgsToSearch: Organisation[], orgId: number) => {
  return throwsErrorIfNullOrUndefined(orgsToSearch.find((o) => o.id === orgId))
}

export const getVenueFromId = (venuesToSearch: Venue[], venueId: number) => {
  return throwsErrorIfNullOrUndefined(venuesToSearch.find((v) => v.id === venueId))
}
