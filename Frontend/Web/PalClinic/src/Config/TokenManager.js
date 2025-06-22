import { BASE_URL } from "../Config/Urls";

export const getAccessToken =  () =>
  localStorage.getItem("accessToken");

export const getRefreshToken =  () =>
  localStorage.getItem("refreshToken");

export const setTokens =  (access, refresh) => {
   localStorage.setItem("accessToken", access);
   localStorage.setItem("refreshToken", refresh);
};

export const clearTokens =  () => {
   localStorage.removeItem("accessToken");
   localStorage.removeItem("refreshToken");
};

export const refreshAccessToken = async () => {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  const response = await fetch(`${BASE_URL}/Users/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  const data = await response.json();

  if (data?.access) {
     localStorage.setItem("accessToken", data.access);
    return data.access;
  } else {
    await clearTokens();
    return null;
  }
};
