import React from 'react'

import { Button } from '@chakra-ui/react'
import TelegramLoginButton from './TelegramLoginButton'
import { useUserInfo } from '../utils'

const NEXT_PUBLIC_BACKEND_TELEGRAM_USER_ID = 4
const NEXT_PUBLIC_BACKEND_JWT_DEV =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTExMzY0ODY1MCwiZmlyc3RfbmFtZSI6IlBhcnRoIiwidXNlcm5hbWUiOiJncGFydGgyNiIsImF1dGhfZGF0ZSI6MTY3OTkxNDc0MiwicGhvdG9fdXJsIjoiaHR0cHM6Ly90Lm1lL2kvdXNlcnBpYy8zMjAvZ0VtVHBfbDR1WUJueWQ3elZFZTQxVGRuQWhQczgtMmJnbXY3MXc4ZzM2US5qcGciLCJoYXNoIjoiMTY1NDJkYzU4NzZiNWExNmRjNGQwMWQ5NjFlODY0OTI2MjljOTlkODIwZGFjZDJlYmJhNGFiMzdkYjg1N2Y3NSIsImlhdCI6MTY3OTkxNDc0NCwiZXhwIjoxNjc5OTE4MzQ0fQ.r1OIa4o5j-XRjTCR3-HrJo166Oo3bZJV6DDN1eg7Qho'
const NEXT_PUBLIC_NGINX_PROXY_ON = false

const Auth: React.FC = () => {
  const [auth, setAuth, cleanUpAuth] = useUserInfo()

  const loginButtonDev = (
    <Button
      onClick={() => {
        // TODO security hole despite process.env.NODE_ENV, but leaving it here for testing for now
        setAuth({
          token: NEXT_PUBLIC_BACKEND_JWT_DEV,
          orgIds: [0],
          userId: NEXT_PUBLIC_BACKEND_TELEGRAM_USER_ID,
        })
      }}
    >
      Login for dev
    </Button>
  )

  const loginButtonWidget = (
    <TelegramLoginButton
      botName={process.env.NODE_ENV === 'development' ? 'TestForUSDevsBot' : 'usdevs_bot'}
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
        fetch('http://localhost:3000/login', body)
          .then((response) => response.text())
          .then((data) => {
            //todo add type here for backend response from the backend repo, see issue #22 on github
            const { token, orgIds } = JSON.parse(data)
            //todo fix the userId
            setAuth({ token, orgIds, userId: NEXT_PUBLIC_BACKEND_TELEGRAM_USER_ID })
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
