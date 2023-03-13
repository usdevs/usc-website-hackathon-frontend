import React from 'react';

import { Button } from '@chakra-ui/react';
import TelegramLoginButton, { TelegramUser } from './TelegramLoginButton';
import { useGlobalState } from './swr-internal-state-main';

const NEXT_PUBLIC_BACKEND_JWT_DEV =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTExMzY0ODY1MCwiZmlyc3RfbmFtZSI6IlBhcnRoIiwidXNlcm5hbWUiOiJncGFydGgyNiIsImF1dGhfZGF0ZSI6MTY3ODcwMTcwNiwicGhvdG9fdXJsIjoiaHR0cHM6Ly90Lm1lL2kvdXNlcnBpYy8zMjAvZ0VtVHBfbDR1WUJueWQ3elZFZTQxVGRuQWhQczgtMmJnbXY3MXc4ZzM2US5qcGciLCJoYXNoIjoiZmQ5Njg2Y2IyYmI5NTdkNGNiOTA1MDczMjNhNTQ5NzNhMjhiYWFiNDdlYTc4NzEzOGQzMzYzMzU3MjMwZDkwMiIsImlhdCI6MTY3ODcwMTcwOCwiZXhwIjoxNjc4NzA1MzA4fQ.I7ZJE9k0yNjSzZJBZdhHh-hHrsLm8QiV4jc2lEf5MiE';
const NEXT_PUBLIC_NGINX_PROXY_ON = true;
interface AuthState {
  token: string;
}
const useUserInfo = () => useGlobalState<AuthState>('token-value', { token: '' });

const Auth: React.FC = () => {
  const [auth, setAuth] = useUserInfo();

  const loginButtonDev = (
    <Button
      onClick={() => {
        setAuth({ token: NEXT_PUBLIC_BACKEND_JWT_DEV });
      }}
    >
      Login for dev
    </Button>
  );

  const loginButtonWidget = (
    <TelegramLoginButton
      botName={process.env.NODE_ENV === 'development' ? 'TestForUSDevsBot' : 'usdevs_bot'}
      dataOnauth={(user: TelegramUser) => {
        const headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        };
        const body = {
          method: 'POST',
          body: JSON.stringify(user),
          headers: headers,
        };
        fetch('http://localhost:3000/login', body)
          .then((response) => response.text())
          .then((data) => {
            setAuth({ token: data });
          })
          .catch((error) => {
            alert(error);
          });
      }}
    />
  );

  const logoutButton = (
    <Button
      onClick={() => {
        setAuth({ token: '' });
      }}
    >
      Logout
    </Button>
  );

  return auth?.token === ''
    ? process.env.NODE_ENV === 'development'
      ? NEXT_PUBLIC_NGINX_PROXY_ON
        ? loginButtonWidget
        : loginButtonDev
      : loginButtonWidget
    : logoutButton;
};
export default Auth;
