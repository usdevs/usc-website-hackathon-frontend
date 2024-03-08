import { useGlobalState } from '../components/swr-internal-state-main'
import { Fetcher } from 'swr'

export const useBookingCellStyles = () => useGlobalState<number>('root-font-size', 16)

export const ALL_VENUES_KEYWORD: Venue = { id: 0, name: 'All Venues' }

export const isUserLoggedIn = (auth: AuthState | null): auth is AuthState => {
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
  {
    label: 'Admin',
    href: '/admin',
  },
  {
    label: 'Stylio',
    href: '/stylio',
  },
]

// Following 8 point grid system
export const BOOKING_CELL_BORDER_Y_REM = 0.25

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
  return throwsErrorIfNullOrUndefined(
    orgsToSearch.find((o) => o.id === orgId),
    "The user's orgIds could not be found" + ' in the database',
  )
}

export const getVenueFromId = (venuesToSearch: Venue[], venueId: number) => {
  return throwsErrorIfNullOrUndefined(
    venuesToSearch.find((v) => v.id === venueId),
    'Unable to map the venue' + ' selected in the frontend to a venue in the database',
  )
}

export const getFromUrlStringAndParseJson: Fetcher<any, string> = (url: string): Promise<any> => {
  return fetch(url).then((res: Response) => res.json())
}

export const getFromUrlStringAndParseJsonWithAuth: Fetcher<any, string[]> = ([
  url,
  token,
]: string[]): Promise<any> => {
  return makeFetchToUrlWithAuth(url, token, 'GET').then((res) => res.responseJson)
}

export const getFromUrlArrayAndParseJson: Fetcher<any, string[]> = (
  url: string[],
): Promise<any> => {
  const combinedUrl = url.join('')
  return fetch(combinedUrl).then((res: Response) => res.json())
}

export const makeFetchToUrlWithAuth = async (
  url: string,
  token: string,
  method: string,
  body: string = '',
): Promise<any> => {
  if (token === '') {
    throw new Error('Token not provided to backend')
  }
  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  }
  if (method !== 'GET' && method !== 'DELETE') {
    requestOptions.body = body
  }
  const response = await fetch(url, requestOptions)
  if (!response.ok) {
    const message = (await response.json()).message ?? 'No message provided'
    throw new Error(`Error: ${response.status}: ${response.statusText} - ${message}`)
  }
  const responseJson = await response.json()
  return { responseJson, responseStatus: response.status }
}
