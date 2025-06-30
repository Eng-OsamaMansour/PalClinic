import { BASE_URL } from "../../Config/Urls";
import { getValidAccessToken } from "../../Config/ValidAccessToken";

/**
 *
 * @param {Object} payload
 */
export async function createClinic(payload) {
  const token = await getValidAccessToken();
  if (!token) throw new Error("No valid token");

  const res = await fetch(`${BASE_URL}/clinic/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const msg = data?.detail || `Server error (${res.status})`;
    throw new Error(msg);
  }
  return res;
}
