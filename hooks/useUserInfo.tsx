import { useLocalStorageWithTTL } from '../components/swr-internal-state-main'

export const useUserInfo = () => useLocalStorageWithTTL<AuthState>('user-profile')
