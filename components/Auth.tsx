import React from 'react'

import { Button } from '@chakra-ui/react'
import TelegramLoginButton from './TelegramLoginButton'
import { useUserInfo } from '../utils'

// { Parth: 22, Zhi Sheng: 23, Megan: 24, Conrad: 25 } based on 2 April seed file
const NEXT_PUBLIC_BACKEND_TELEGRAM_USER_ID = 22
const NEXT_PUBLIC_BACKEND_JWT_DEV =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTExMzY0ODY1MCwiZmlyc3RfbmFtZSI6IlBhcnRoIiwidXNlcm5hbWUiOiJncGFydGgyNiIsImF1dGhfZGF0ZSI6MTY4NjU1NzAyNCwicGhvdG9fdXJsIjoiaHR0cHM6Ly90Lm1lL2kvdXNlcnBpYy8zMjAvZ0VtVHBfbDR1WUJueWQ3elZFZTQxVGRuQWhQczgtMmJnbXY3MXc4ZzM2US5qcGciLCJoYXNoIjoiYjQ1Zjg3OGU3MDQ2NGJlOTM3YzIwMjA0NzRkYzM5NDYwODJjYjM1ZDFmMTZiMGY3Mzg3NDdkZTJmNzNmZWVmZSIsImlhdCI6MTY4NjU1NzAyNywiZXhwIjoxNjg2NTYwNjI3fQ.00OQJ5Td1G5nN6ukyAkt6Altpw5pJF3ix_zuiWs6acM'
const NEXT_PUBLIC_NGINX_PROXY_ON = true

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
