import React, { useEffect } from 'react'

import { Button } from '@chakra-ui/react'
import TelegramLoginButton from './TelegramLoginButton'
import { isUserLoggedIn } from '../utils'
import { useUserInfo } from '../hooks/useUserInfo'
import * as process from 'process'
import { ROLES } from '../constants/roles'

const Auth: React.FC = () => {
  const [authOrNull, setAuth, cleanUpAuth] = useUserInfo()

  const handleAuth = async (user: TelegramUser) => {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
    user.id = String(user.id)
    const body = {
      method: 'POST',
      body: JSON.stringify(user),
      headers: headers,
    }
    await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'login', body)
      .then(async (response) => {
        if (response.status !== 200) {
          throw new Error((await response.text()) ?? 'Unable to fetch login data from backend')
        }
        return response.json()
      })
      .then((res) => {
        const { token, orgIds, userCredentials, userId, roles } = res
        if (userCredentials === undefined) {
          throw new Error('Undefined userCredentials received')
        }
        const userInfo = {
          firstName: userCredentials.first_name,
          telegramId: userCredentials.id,
          photoUrl: userCredentials.photo_url,
          username: userCredentials.username,
        }
        const isAdminUser = roles.some((role: string) => role === ROLES.WebsiteAdmin)
        setAuth({ token, orgIds, userInfo, userId, roles, isAdminUser, setupTime: new Date() })
      })
      .catch((error) => {
        alert(error)
      })
  }

  useEffect(() => {
    const cleanup = async () => {
      if (isUserLoggedIn(authOrNull)) {
        // @ts-ignore because we do the null check already
        const { setupTime } = authOrNull
        const timeSinceSetup: number = Date.now() - setupTime.getMilliseconds()
        if (timeSinceSetup >= (30 + 1) * 60 * 1000) {
          await cleanUpAuth()
        }
      }
    }
    cleanup()
  }, [authOrNull, cleanUpAuth])

  const handleDevAuth = async () => {
    const username = process.env.NEXT_PUBLIC_TELEGRAM_USERNAME_DEV ?? 'test'
    const id = `DEV_ID_${username}`
    await handleAuth({
      id: id,
      first_name: username,
      username: username,
      photo_url: '',
      auth_date: 0,
      hash: 'none',
    })
  }

  const loginButtonDev = <Button onClick={handleDevAuth}>Login for dev</Button>

  const loginButtonWidget = (
    <TelegramLoginButton
      // BOT_TOKEN on the backend needs to match
      botName={process.env.NEXT_PUBLIC_TELEGRAM_LOGIN_BOT ?? 'TestForUSDevsProdBot'}
      dataOnauth={handleAuth}
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

  if (isUserLoggedIn(authOrNull)) {
    return logoutButton
  }

  if (process.env.NODE_ENV === 'development') {
    if (process.env.NEXT_PUBLIC_NGINX_PROXY_ON === 'true') {
      return loginButtonWidget
    }
    return loginButtonDev
  }

  return loginButtonWidget
}
export default Auth
