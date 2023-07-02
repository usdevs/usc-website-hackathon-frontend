import React from 'react'

import { Button } from '@chakra-ui/react'
import TelegramLoginButton from './TelegramLoginButton'
import { isUserLoggedIn } from '../utils'
import { useUserInfo } from '../hooks/useUserInfo'

// { Parth: 22, Zhi Sheng: 23, Megan: 24, Conrad: 25 } based on 2 April seed file
const NEXT_PUBLIC_BACKEND_TELEGRAM_USER_ID = 23
const NEXT_PUBLIC_BACKEND_JWT_DEV =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTA1MzAyNzUxLCJmaXJzdF9uYW1lIjoiemhpIHNoZW5nIiwidXNlcm5hbWUiOiJvcHRpY2FsY2xvdWQiLCJhdXRoX2RhdGUiOjE2ODgxOTY2MjYsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwLzVma1MzR2RTc1Atb1dtNk9ZcVNKVHpjV2pVN1BqLU1PcjIwdmFvSmZPRVEuanBnIiwiaGFzaCI6ImJiZjNiMjkwZWIxN2Q3OTU2NmQ1MWUyNWY3MzY4OGFhYjIwYjc4MGRjNzBmOGNhMGUzZjgwOTczYzcwZDNjZDQiLCJpYXQiOjE2ODgxOTY2MjgsImV4cCI6MTY4ODIwMDIyOH0.KKrtXYIFKTWW90R8IMamrME1b2N56hk9Ck3iw1mP7Is'
const NEXT_PUBLIC_NGINX_PROXY_ON = false

const Auth: React.FC = () => {
  const [auth, setAuth, cleanUpAuth] = useUserInfo()

  const loginButtonDev = (
    <Button
      onClick={() => {
        setAuth({
          token: NEXT_PUBLIC_BACKEND_JWT_DEV,
          orgIds: [66, 67],
          userId: NEXT_PUBLIC_BACKEND_TELEGRAM_USER_ID,
          // userInfo is not needed for now, so can just add filler values
          userInfo: {
            firstName: 'Parth',
            telegramId: -1,
            photoUrl: '',
            username: 'gparth26',
          },
          setupTime: new Date(),
        })
      }}
    >
      Login for dev
    </Button>
  )

  const loginButtonWidget = (
    <TelegramLoginButton
      // BOT_TOKEN on the backend needs to match
      botName={process.env.NODE_ENV === 'development' ? 'TestForUSDevsBot' : 'TestForUSDevsProdBot'}
      dataOnauth={(user: TelegramUser) => {
        const headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
        const body = {
          method: 'POST',
          body: JSON.stringify(user),
          headers: headers,
        }
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'login', body)
          .then((response) => response.text())
          .then((data) => {
            //todo add type here for backend response from the backend repo, see issue #22 on github
            const { token, orgIds, userCredentials, userId } = JSON.parse(data)
            const userInfo = {
              firstName: userCredentials.first_name,
              telegramId: userCredentials.id,
              photoUrl: userCredentials.photo_url,
              username: userCredentials.username,
            }
            setAuth({ token, orgIds, userInfo, userId, setupTime: new Date() })
          })
          .catch((error) => {
            alert(error)
          })
      }}
    />
  )

  const logoutButton = (
    <Button
      onClick={() => {
        cleanUpAuth()
      }}
    >
      Logout
    </Button>
  )

  return isUserLoggedIn(auth)
    ? logoutButton
    : process.env.NODE_ENV === 'development'
    ? NEXT_PUBLIC_NGINX_PROXY_ON
      ? loginButtonWidget
      : loginButtonDev
    : loginButtonWidget
}
export default Auth
