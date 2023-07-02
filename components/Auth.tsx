import React, { useEffect } from 'react'

import { Button } from '@chakra-ui/react'
import TelegramLoginButton from './TelegramLoginButton'
import { isUserLoggedIn } from '../utils'
import { useUserInfo } from '../hooks/useUserInfo'
import * as process from 'process'

const Auth: React.FC = () => {
  const [auth, setAuth, cleanUpAuth] = useUserInfo()

  useEffect(() => {
    ;(async () => {
      if (window.localStorage.getItem('user-profile') !== null) {
        await cleanUpAuth()
      }
    })()
  }, [cleanUpAuth])

  const loginButtonDev = (
    <Button
      onClick={async () => {
        await setAuth({
          token: process.env.NEXT_PUBLIC_BACKEND_JWT_DEV || '',
          orgIds: [66, 67],
          userId: Number(process.env.NEXT_PUBLIC_BACKEND_TELEGRAM_USER_ID) || 22,
          // userInfo is not needed for now, so can just add filler values
          userInfo: {
            firstName: 'Test',
            telegramId: -1,
            photoUrl: '',
            username: 'telegramUsername',
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
      dataOnauth={async (user: TelegramUser) => {
        const headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
        const body = {
          method: 'POST',
          body: JSON.stringify(user),
          headers: headers,
        }
        await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'login', body)
          .then((response) => response.text())
          .then((data) => {
            //todo add type here for backend response from the backend repo, see issue #22 on github
            const { token, orgIds, userCredentials, userId } = JSON.parse(data)
            if (data === undefined || userCredentials === undefined) {
              throw new Error('Unable to fetch login data from backend')
            }
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
      onClick={async () => {
        await cleanUpAuth()
      }}
    >
      Logout
    </Button>
  )

  return isUserLoggedIn(auth)
    ? logoutButton
    : process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_NGINX_PROXY_ON === 'true'
      ? loginButtonWidget
      : loginButtonDev
    : loginButtonWidget
}
export default Auth
