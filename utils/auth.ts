import { ROLES } from '../constants/roles'

export const checkIsWebsiteAdmin = (auth: AuthState | null) => {
  if (!auth) return false
  return auth.roles.includes(ROLES.WebsiteAdmin)
}

export const checkIsBookingAdmin = (auth: AuthState | null) => {
  if (!auth) return false
  return checkIsWebsiteAdmin(auth) || auth.roles.includes(ROLES.BookingAdmin)
}

export const checkIsAcadsAdmin = (auth: AuthState | null) => {
  if (!auth) return false
  return checkIsWebsiteAdmin(auth) || auth.roles.includes(ROLES.AcadsAdmin)
}

export const checkIsSpacesAdmin = (auth: AuthState | null) => {
  if (!auth) return false
  return checkIsWebsiteAdmin(auth) || auth.roles.includes(ROLES.SpacesAdmin)
}

export const checkIsOrgHead = (auth: AuthState | null) => {
  if (!auth) return false
  return checkIsWebsiteAdmin(auth) || auth.roles.includes(ROLES.OrganisationHead)
}
