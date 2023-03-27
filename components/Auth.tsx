import React from 'react';

import { Button } from '@chakra-ui/react';
import TelegramLoginButton from './TelegramLoginButton';
import { useLocalStorage } from './swr-internal-state-main';

const NEXT_PUBLIC_BACKEND_JWT_DEV =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTA1MzAyNzUxLCJmaXJzdF9uYW1lIjoiemhpIHNoZW5nIiwidXNlcm5hbWUiOiJvcHRpY2FsY2xvdWQiLCJhdXRoX2RhdGUiOjE2Nzk4OTc3NDksInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwLzVma1MzR2RTc1Atb1dtNk9ZcVNKVHpjV2pVN1BqLU1PcjIwdmFvSmZPRVEuanBnIiwiaGFzaCI6ImI1NGIyZWY0ZGVlNWY2MzI5OWJmMjQ3ZDY1ODJhNzFhY2Q5MmJjMjFhOTQ5YzZkYmIyM2E2ZGU1Y2EzYWU4YmMiLCJpYXQiOjE2Nzk4OTc3NTIsImV4cCI6MTY3OTkwMTM1Mn0.9_WjGPo6rGYJ1KfIEC4DIp9aSTTVQT1v42KyCYNR1Hs';
const NEXT_PUBLIC_NGINX_PROXY_ON = false;

const useUserInfo = () => useLocalStorage<AuthState>('token-value', { token: '', orgIds: [] });

const Auth: React.FC = () => {
  const [auth, setAuth, cleanUpAuth] = useUserInfo();

  const loginButtonDev = (
    <Button
      onClick={() => {
        // TODO security hole despite process.env.NODE_ENV, but leaving it here for testing for now
        setAuth({ token: NEXT_PUBLIC_BACKEND_JWT_DEV, orgIds: [0] });
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
            //todo add type here for backend response from the backend repo, see issue #22 on github
            const { token, orgIds } = JSON.parse(data);
            setAuth({ token, orgIds });
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
        cleanUpAuth();
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
