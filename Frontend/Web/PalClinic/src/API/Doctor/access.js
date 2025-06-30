import { BASE_URL } from "../../Config/Urls";
import { getValidAccessToken } from "../../Config/ValidAccessToken";

async function api(path, opts = {}) {
  const token = await getValidAccessToken();
  if (!token) throw new Error("لا يوجد رمز دخول صالح");
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    ...opts,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || `خطأ ${res.status}`);
  return data;
}

export const fetchRequests = () => api("/AccessControl/access_requst/get/");
export const fetchPatients = () => api("/Users/get_patient/");
export const sendRequest   = (patientId) =>
  api(`/AccessControl/access_request/${patientId}`, { method: "POST" });