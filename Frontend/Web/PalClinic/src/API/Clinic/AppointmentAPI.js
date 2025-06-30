import { BASE_URL } from "../../Config/Urls";
import { getValidAccessToken } from "../../Config/ValidAccessToken";
import { getClinic } from "../../Config/ClinicManager";

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

  if (res.status === 204 || res.headers.get("Content-Length") === "0") {
    return null; 
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

export const fetchAppointments = async () => {
  const { id } = getClinic();
  return authedFetch(`/appointment/${id}/`);
};

export const createAppointment = async (payload) =>
  authedFetch("/appointment/create/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateAppointment = async (id, payload) =>
  authedFetch(`/appointment/update/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const deleteAppointment = async (id) =>
  authedFetch(`/appointment/delete/${id}/`, { method: "DELETE" });

/* ---------- Assigned doctors ---------- */
export const fetchAssignedDoctors = async () => {
  const { id } = getClinic();
  return authedFetch(`/AccessControl/assigndoctortoclinic/${id}`);
};


export const listDoctorAppointments = () => authedFetch("/appointment/list/");