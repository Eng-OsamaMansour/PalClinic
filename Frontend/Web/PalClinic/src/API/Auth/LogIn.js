import { BASE_URL } from "../../Config/Urls";
import { getAccessToken } from "../../Config/TokenManager";

const login = async (email, password) => {
  const response = await fetch(`${BASE_URL}/Users/signIn/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  console.log(response.ok);
  return response;
};

const getUserApi = async () => {
  const response = await fetch(`${BASE_URL}/Users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  return response;
};

const getClinicApi = async () => {
  const response = await fetch(`${BASE_URL}/clinic/mod/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  return response
};

export default login;
export { getUserApi,getClinicApi };
