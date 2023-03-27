import { useLocalStorage } from "./components/swr-internal-state-main";

export const useUserInfo = () => useLocalStorage<AuthState>('token-value', { token: '', orgIds: [], userId: -1 });
