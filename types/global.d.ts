export {}

declare global {
  interface NavigationLink {
    href: string
    label: string
  }

  type Venue = {
    id: number
    name: string
  }

  type Organisation = {
    id: number
    name: string
    description: string
    verified: boolean
    inviteLink: string
    slug: string
    category: IGCategory
  }

  type UserOnOrg = {
    user: User
    isIGHead: boolean
    org: Organisation
  }

  type OrganisationWithIGHead = Organisation & {
    userOrg: UserOnOrg[]
  }

  type BookingDataBackend = {
    id: number
    venueId: number
    userId: number
    orgId: number
    start: string
    end: string
    bookedAt: string
    eventName: string
    bookedByUser: User
    bookedBy: UserOnOrg
  }

  type BookingDataDisplay = {
    id: number
    venueId: number
    userId: number
    orgId: number
    start: string
    end: string
    bookedAt: string
    from: Date
    to: Date
    eventName: string
    bookedByUser: User
    bookedBy: UserOnOrg
  }

  interface BookingDataSelection {
    start: Date | null
    end: Date | null
    venueId: number
  }

  interface TelegramUser {
    id: number
    first_name: string
    username: string
    photo_url: string
    auth_date: number
    hash: string
  }

  interface UserInformation {
    firstName: string
    telegramId: number
    photoUrl: string
    username: string
  }

  interface AuthState extends ObjectWithSetupTime {
    token: string
    orgIds: Array<number>
    userInfo: UserInformation | null
    userId: number
  }

  interface BookingDataForm {
    eventName: string
    orgId: number
  }

  interface User {
    id: number
    name: string
    telegramUserName: string
  }

  interface ToggleProps {
    isOn: boolean
    setIsOn: (isOn: boolean) => void
  }

  export interface ObjectWithSetupTime {
    setupTime: Date
  }

  export type FetcherFn = <T extends ObjectWithSetupTime>(
    url: URL,
    key: string,
    defaultValue: T | null,
  ) => (url: URL) => Promise<T | null>

  export interface StringToStringJSObject {
    [index: string]: string
  }

  export interface NumberToStringJSObject {
    [index: number]: string
  }
}
