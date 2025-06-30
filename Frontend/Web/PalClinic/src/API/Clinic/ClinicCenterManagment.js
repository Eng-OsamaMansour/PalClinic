import { BASE_URL } from "../../Config/Urls";
import { getValidAccessToken } from "../../Config/ValidAccessToken";

async function authedFetch(path, opts = {}) {
  const token = await getValidAccessToken();
  if (!token) throw new Error("No valid token");
  const res = await fetch(`${BASE_URL}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.detail || `Server error (${res.status})`);
  }
  return res.json();
}

export const getUnassignedClinicsCenter = () => authedFetch("/clinic/center/unassigned");

export const getCenters = () => authedFetch("/healthcarecenter/");

export const assignClinicToCenter = (health, clinic) =>
  authedFetch("/AccessControl/assignclinichealth/", {
    method: "POST",
    body: JSON.stringify({ health, clinic }),
  });

export const getAssignments = () => authedFetch("/clinic/center/assigned/");

export const deactivateAssignment = (id) =>
  authedFetch(`/AccessControl/assignclinichealth/update/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ is_active: false }),
  });
