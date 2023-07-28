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
    isAdminOrg: boolean
    inviteLink: string
    slug: string
    category: IGCategory
    isInactive: boolean
    isInvisible: boolean
  }

  type OrganisationForm = Omit<Organisation, 'slug'> & {
    igHead: number
    otherMembers: number[]
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
    bookedBy: UserOnOrg
  }

  type BookingDataDisplay = BookingDataBackend & {
    from: Date
    to: Date
  }

  interface BookingDataSelection {
    start: Date
    end: Date
    venueId: number
  }

  interface TelegramUser {
    id: string
    first_name: string
    username: string
    photo_url: string
    auth_date: number
    hash: string
  }

  interface UserInformation {
    firstName: string
    telegramId: string
    photoUrl: string
    username: string
  }

  interface AuthState extends ObjectWithSetupTime {
    token: string
    orgIds: Array<number>
    userInfo: UserInformation | null
    userId: number
    isAdminUser: boolean
  }

  interface BookingDataForm {
    eventName: string
    orgId: number
  }

  interface User {
    id: number
    name: string
    telegramUserName: string
    telegramId?: string
  }

  interface ToggleProps {
    isOn: boolean
    setIsOn: (isOn: boolean) => void
  }

  export interface ObjectWithSetupTime {
    setupTime: Date
  }

  export interface StringToStringJSObject {
    [index: string]: string
  }

  export interface NumberToStringJSObject {
    [index: number]: string
  }
}
