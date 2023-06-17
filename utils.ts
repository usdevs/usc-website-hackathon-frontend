import { useLocalStorage, useGlobalState } from './components/swr-internal-state-main'

export const useBookingCellStyles = () => useGlobalState<number>('root-font-size', 16)

export const useUserInfo = () =>
  useLocalStorage<AuthState>('user-profile', { token: '', orgIds: [], userInfo: null, userId: -1 })

// TODO this should be fetched from the backend, and in the same order always
export const VENUES = ['CTPH', 'Chatterbox', "Maker's Studio", 'Amphi', 'TRR', 'TRB']

export const ALL_VENUES_KEYWORD = 'All Venues'

export const isUserLoggedIn = (auth: AuthState | null): boolean => {
  return auth !== null && auth.token !== ''
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
