import React from 'react'

import { Button } from '@chakra-ui/react'
import TelegramLoginButton from './TelegramLoginButton'
import { useUserInfo } from '../utils'

// { Parth: 4, Zhi Sheng: 5, Megan: 6, Conrad: 7 } based on 2 April seed file
const NEXT_PUBLIC_BACKEND_TELEGRAM_USER_ID = 7
const NEXT_PUBLIC_BACKEND_JWT_DEV =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzA1MjQ0MTIwLCJmaXJzdF9uYW1lIjoiTGV3IEtpYW4gTG9vbmcsIENvbnJhZCIsInVzZXJuYW1lIjoib3Jxb2kiLCJhdXRoX2RhdGUiOjE2ODY1ODM1NDAsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL1otOHNvYk1MbEVOVkt4bEIxNXpDWG0zRmFRVnI1SF9TVGRZWjRqVFA1anMuanBnIiwiaGFzaCI6IjI2ODg0ODk1MTEwZWQxMTU2N2VhMGNmMzVmMWQyNzc2MDU2N2ViZDMzNzkwMWZhZGY4ZjMyNmViZjVmNmMyMjEiLCJpYXQiOjE2ODY1ODM1NDIsImV4cCI6MTY4NjU4NzE0Mn0.Ani5dlBxMlJ9UyYgUxteHhHnRLuOUAHgOyFJ7Xh9w5g'
const NEXT_PUBLIC_NGINX_PROXY_ON = false

const Auth: React.FC = () => {
  const [auth, setAuth, cleanUpAuth] = useUserInfo()

  const loginButtonDev = (
    <Button
      onClick={() => {
        setAuth({
          token: NEXT_PUBLIC_BACKEND_JWT_DEV,
          orgIds: [0],
          userId: NEXT_PUBLIC_BACKEND_TELEGRAM_USER_ID,
          // userInfo is not needed for now, so can just add filler values
          userInfo: {
            firstName: 'Parth',
            telegramId: -1,
            photoUrl: '',
            username: 'gparth26',
          },
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
            setAuth({ token, orgIds, userInfo, userId })
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

  return auth?.token === ''
    ? process.env.NODE_ENV === 'development'
      ? NEXT_PUBLIC_NGINX_PROXY_ON
        ? loginButtonWidget
        : loginButtonDev
      : loginButtonWidget
    : logoutButton
}
export default Auth
