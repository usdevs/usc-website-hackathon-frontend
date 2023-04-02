import { Dispatch, SetStateAction } from 'react'

export {}

declare global {
  interface ButtonInfo {
    name: string
    link: string
  }

  interface IGInfo {
    contact: string
    invite_link: string
    image: string
    title: string
    description: string
    category: string
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
    bookedByName: string
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
    bookedByName: string
    eventName: string
  }

  interface BookingDataSelection {
    start: Date | null
    end: Date | null
    venueId: number
    venueName: string
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

  interface AuthState {
    token: string
    orgIds: Array<number>
    userInfo: UserInformation | null
    userId: number
  }

  interface BookingDataForm {
    eventName: string
    orgId: number
  }

  interface OrgInfo {
    id: number
    name: string
    description: string
    verified: boolean
  }
  interface ToggleProps {
    isOn: boolean
    setIsOn: (isOn: boolean) => void
  }
}
