import { BASE_URL } from "../Config/Urls";
import { getValidAccessToken } from "../Config/ValidAccessToken";

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

export const getUnassignedCenters = () =>
  authedFetch("/healthcarecenter/unassigned");

export const getHCModerators = () =>
  authedFetch("/Users/get_hc_moderators/");

export const assignModerator = (moderator, healthcarecenter) =>
  authedFetch("/AccessControl/assignhealthmoderator", {
    method: "POST",
    body: JSON.stringify({ moderator, healthcarecenter }),
  });

export const getAssignments = () =>
  authedFetch("/healthcarecenter/assigned/");

export const deactivateAssignment = (id) =>
  authedFetch(`/AccessControl/assignedhealthmodirator/update/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ is_active: false }),
  });
