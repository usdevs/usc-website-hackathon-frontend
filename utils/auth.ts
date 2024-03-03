export const checkIsWebsiteAdmin = (auth: AuthState | null) => {
  if (!auth) return false
  return auth.permissions.isAdmin
}

export const checkIsAcadsAdmin = (auth: AuthState | null) => {
  if (!auth) return false
  return auth.permissions.isAcadsAdmin
}

/** Backend returns a map of whether a user is an admin for a specific venue id. */
export const checkIsVenueAdmin = (auth: AuthState | null, venueId: number) => {
  if (!auth) return false
  return !!auth.permissions.venueIdToIsVenueAdmin[venueId]
}
