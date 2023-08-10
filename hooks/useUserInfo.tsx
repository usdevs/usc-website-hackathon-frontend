import {
  RemoveValue,
  SetValue,
  useLocalStorageWithTTL,
} from '../components/swr-internal-state-main'
import { throwsErrorIfNullOrUndefined } from '../utils'

export const useUserInfo = () => useLocalStorageWithTTL<AuthState>('user-profile', null, 30)

// this hook builds on top of the hook above, for components where the user must have already logged in - for
// example, when making a booking, the user must have already logged in previously and so `auth` must not be null
export const useUserInfoNonNull = (): [AuthState, SetValue<AuthState>, RemoveValue] => {
  const [authOrNull, setAuthOrNull, cleanUpAuthOrNull] = useUserInfo()
  const auth: AuthState = throwsErrorIfNullOrUndefined(authOrNull)
  return [auth, setAuthOrNull, cleanUpAuthOrNull]
}
