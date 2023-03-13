import { TelegramUser } from "../../components/TelegramLoginButton";

export function getJwtTokenFromBackend(user: TelegramUser) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json"
  };

  const body = {
    method: "POST",
    body: JSON.stringify(user),
    headers: headers
  };
  return fetch("http://localhost:3000/login", body)
    .then((response) => response.text())
    .catch((error) => {
      return ""
    });
}
