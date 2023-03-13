import React from "react";

// import { useAppSelector, useAppDispatch } from "../../redux_app/hooks";
import { Button } from "@chakra-ui/react";
import { TokenGetterContext } from "../../pages/TokenGetterProvider";
import { TokenSetterContext } from "../../pages/TokenSetterProvider";
import { useContext } from "react";
import TelegramLoginButton, { TelegramUser } from "../../components/TelegramLoginButton";

export function Auth() {
  const { token } = useContext(TokenGetterContext);
  const { setToken } = useContext(TokenSetterContext);

  setToken(process.env.NEXT_BACKEND_JWT_DEV || "");

  const TeleLogin = <TelegramLoginButton botName={ process.env.NODE_ENV === "development" ? "TestForUSDevsBot" : "usdevs_bot"}
                                         dataOnauth={(user: TelegramUser) => {
                                           // fetchJwtToken(user)
                                         }} />

  const loginButton = <Button onClick={() => {}}>
    Login for dev
  </Button>;
  const logoutButton = <Button onClick={() => {}}>
    Logout
  </Button>;

  console.log("token" + token + "end");

  return token === "" ? loginButton : logoutButton;
}
