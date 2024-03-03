export const checkIsWebsiteAdmin = (auth: AuthState | null) => {
  if (!auth) return false
  return auth.permissions.isAdmin
}

export const checkIsBookingAdmin = (auth: AuthState | null) => {
  if (!auth) return false
  return auth.permissions.isBookingAdmin
}

export const checkIsAcadsAdmin = (auth: AuthState | null) => {
  if (!auth) return false
  return auth.permissions.isAcadsAdmin
}

export const checkIsSpacesAdmin = (auth: AuthState | null) => {
  if (!auth) return false
  return auth.permissions.isSpacesAdmin
}

export const checkIsOrgHead = (auth: AuthState | null) => {
  if (!auth) return false
  return auth.permissions.isOrgHead
}
