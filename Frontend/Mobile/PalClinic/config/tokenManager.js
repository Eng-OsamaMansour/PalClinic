import * as SecureStore from "expo-secure-store";
import { BASE_URL } from "./config";

export const getAccessToken = async () =>
  await SecureStore.getItemAsync("accessToken");

export const getRefreshToken = async () =>
  await SecureStore.getItemAsync("refreshToken");

export const setTokens = async (access, refresh) => {
  await SecureStore.setItemAsync("accessToken", access);
  await SecureStore.setItemAsync("refreshToken", refresh);
};

export const clearTokens = async () => {
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
};

export const refreshAccessToken = async () => {
  const refresh = await getRefreshToken();
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
    await SecureStore.setItemAsync("accessToken", data.access);
    return data.access;
  } else {
    await clearTokens();
    return null;
  }
};
