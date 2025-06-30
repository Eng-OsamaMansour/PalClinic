import { BASE_URL } from "../../Config/Urls";
import { getValidAccessToken } from "../../Config/ValidAccessToken";

async function api(path, opts = {}) {
  const token = await getValidAccessToken();
  if (!token) throw new Error("No valid token");
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...opts,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || `Error ${res.status}`);
  return data;
}


export const listCenters = () => api("/healthcarecenter/");
export const patchCenter = (id, payload) =>
  api(`/healthcarecenter/update/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
