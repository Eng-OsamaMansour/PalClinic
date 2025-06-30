import { BASE_URL } from "../../Config/Urls";
import { getValidAccessToken } from "../../Config/ValidAccessToken";

async function apiGet(path) {
  const token = await getValidAccessToken();
  if (!token) throw new Error("انتهت الجلسة، سجّل الدخول مجددًا");

  const res  = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || `خطأ ${res.status}`);

  return data;
}

export const listDoctorPatients = () =>
  apiGet("/AccessControl/authorized-patients/");
