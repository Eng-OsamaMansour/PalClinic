import { getRefreshToken } from "../config/TokenManager";
import { BASE_URL } from "../config/Config";

export const SignOut = async () => {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) throw new Error("Unauthorized");

  const response = await fetch(`${BASE_URL}/Users/signOut/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });
  if (!response.ok) {
    throw new Error("Failed to SignOut");
  }

  try {
    return await response.json();
  } catch {
    return true;
  }
};
