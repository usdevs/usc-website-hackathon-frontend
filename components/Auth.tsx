import React from 'react'

import { Button } from '@chakra-ui/react'
import TelegramLoginButton from './TelegramLoginButton'
import { useUserInfo } from '../utils'

const NEXT_PUBLIC_BACKEND_TELEGRAM_USER_ID = 4
const NEXT_PUBLIC_BACKEND_JWT_DEV =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTA1MzAyNzUxLCJmaXJzdF9uYW1lIjoiemhpIHNoZW5nIiwidXNlcm5hbWUiOiJvcHRpY2FsY2xvdWQiLCJhdXRoX2RhdGUiOjE2Nzk5Mjk2NzgsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwLzVma1MzR2RTc1Atb1dtNk9ZcVNKVHpjV2pVN1BqLU1PcjIwdmFvSmZPRVEuanBnIiwiaGFzaCI6ImE4MDhhMDQ5ZDRkOTkwYTQyMGExNjk4YWE2NDgxM2M0MDk0ZmNhOWY3MzU2YTU4NjY0Mjc3ZTQ4YzQ5NTY5NGEiLCJpYXQiOjE2Nzk5Mjk2NzksImV4cCI6MTY3OTkzMzI3OX0.8VA-N01Y2c6wrEvQS3ctJuM_EkmZvyn3AULTEmI-OoY'

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
