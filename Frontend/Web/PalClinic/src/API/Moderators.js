import { BASE_URL } from "../Config/Urls";
import { getValidAccessToken } from "../Config/ValidAccessToken";

export async function createHCModerator(payload) {
  const token = await getValidAccessToken();
  if (!token) throw new Error("No valid token");

  const res = await fetch(`${BASE_URL}/Users/create_hc_moderator/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || "Server error");
  return data;              // {message,email,temp_password}
}
