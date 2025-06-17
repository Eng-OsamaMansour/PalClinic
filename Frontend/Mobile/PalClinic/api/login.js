import { BASE_URL } from "../config/Config";
import { getAccessToken } from "../config/TokenManager";

const login = async (email, password) => {
  const response = await fetch(`${BASE_URL}/Users/signIn/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return response;
};

const getUserApi = async () => {
  const response = await fetch(`${BASE_URL}/Users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getAccessToken()}`,
    },
  });
  return response;
};

export default login;
export { getUserApi };
