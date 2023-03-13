import React, { useState } from "react";

import { useAppSelector, useAppDispatch } from "../../redux_app/hooks";
import { fetchJwtToken, logout, selectToken } from "./authSlice";
import { Button } from "@chakra-ui/react";
import TelegramLoginButton, { TelegramUser } from "../../components/TelegramLoginButton";

export function Auth() {
  const token = useAppSelector(selectToken);
  const dispatch = useAppDispatch();

  const loginButton = process.env.NODE_ENV === "development"
    ? <Button onClick={(event) => {
      fetchJwtToken(user)
    }}>
      Login for dev
    </Button>
    : <TelegramLoginButton botName={process.env.NODE_ENV === "test" ? "TestForUSDevsBot" : "usdevs_bot"}
                           dataOnauth={(user: TelegramUser) => {
                             fetchJwtToken(user)
                           }} />;
  const logoutButton = <Button onClick={() => {
    dispatch(logout());
  }}>
    Logout
  </Button>;

  return token === "" ? loginButton : logoutButton;
  // return (
  //   <div>
  //     <div className={styles.row}>
  //       <button
  //         className={styles.button}
  //         aria-label="Decrement value"
  //         onClick={() => dispatch(decrement())}
  //       >
  //         -
  //       </button>
  //       <span className={styles.value}>{token}</span>
  //       <button
  //         className={styles.button}
  //         aria-label="Increment value"
  //         onClick={() => dispatch(increment())}
  //       >
  //         +
  //       </button>
  //     </div>
  //     <div className={styles.row}>
  //       <input
  //         className={styles.textbox}
  //         aria-label="Set increment amount"
  //         value={incrementAmount}
  //         onChange={(e) => setIncrementAmount(e.target.value)}
  //       />
  //       <button
  //         className={styles.button}
  //         onClick={() => dispatch(incrementByAmount(incrementValue))}
  //       >
  //         Add Amount
  //       </button>
  //       <button
  //         className={styles.asyncButton}
  //         onClick={() => dispatch(incrementAsync(incrementValue))}
  //       >
  //         Add Async
  //       </button>
  //     </div>
  //   </div>
  // );
}
