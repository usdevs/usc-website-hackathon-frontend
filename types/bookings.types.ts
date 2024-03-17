export type Venue = {
  id: number
  name: string
}

export type Organisation = {
  id: number
  name: string
  description: string
  isAdminOrg: boolean
  inviteLink: string
  slug: string
  category: string
  isInactive: boolean
  isInvisible: boolean
}

export type OrganisationForm = Omit<Organisation, 'slug'> & {
  igHead: number
  otherMembers: number[]
}

export type UserOnOrg = {
  user: User
  isIGHead: boolean
  org: Organisation
}

export type OrganisationWithIGHead = Organisation & {
  userOrg: UserOnOrg[]
}

export type BookingDataBackend = {
  id: number
  venueId: number
  userId: number
  userOrgId: number
  bookedForOrgId?: number
  bookedForOrg?: Organisation // this field will only be populated if a user (typically an admin user) has made a
  // booking on behalf of another org
  start: string
  end: string
  bookedAt: string
  eventName: string
  bookedBy: UserOnOrg
}

export type BookingDataDisplay = BookingDataBackend & {
  from: Date
  to: Date
}

export interface BookingDataSelection {
  start: Date
  end: Date
  venueId: number
}

export interface BookingDataForm {
  eventName: string
  orgId: number
}

export interface User {
  id: number
  name: string
  telegramUserName: string
  telegramId?: string
}
