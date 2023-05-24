import { useLocalStorage } from "./components/swr-internal-state-main";

export const useUserInfo = () =>
  useLocalStorage<AuthState>('user-profile', { token: '', orgIds: [], userInfo: null, userId: -1 })

// TODO this should be fetched from the backend, and in the same order always
export const VENUES = ['CTPH', 'Chatterbox', "Maker's Studio", 'Amphi', 'TRR', 'TRB']

export  const ALL_VENUES_KEYWORD = "All Venues";

export const isUserLoggedIn = (auth: AuthState | null): boolean => {
  return auth !== null && auth.token !== ''
}
export const BUTTON_LINKS: ButtonInfo[] = [
  { name: "Student Groups", link: "/student-groups" },
  // { name: 'Houses', link: '#' },
  // { name: 'NOW!', link: '#' },
  { name: "Bookings", link: "/bookings" }
];
