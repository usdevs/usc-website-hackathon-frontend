import { useLocalStorage } from './components/swr-internal-state-main'

export const useUserInfo = () =>
  useLocalStorage<AuthState>('user-profile', { token: '', orgIds: [], userId: -1 })
