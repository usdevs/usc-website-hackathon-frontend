export interface TelegramUser {
  id: string
  first_name: string
  username: string
  photo_url: string
  auth_date: number
  hash: string
}

export interface UserInformation {
  firstName: string
  telegramId: string
  photoUrl: string
  username: string
}

export interface AuthState extends ObjectWithSetupTime {
  token: string
  orgIds: Array<number>
  userInfo: UserInformation | null
  userId: number
  permissions: {
    isAdmin: boolean
    isAcadsAdmin: boolean
    venueIdToIsVenueAdmin: Record<number, boolean>
  }
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
