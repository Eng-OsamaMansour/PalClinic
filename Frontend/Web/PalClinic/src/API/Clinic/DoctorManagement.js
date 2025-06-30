import { getClinic } from "../../Config/ClinicManager";
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

export const getDoctors = () => authedFetch("/Users/get_doctor/");

export const assignDoctor = async (doctor) => {
  const { id: clinic } = getClinic();         
  return authedFetch("/AccessControl/assigndoctortoclinic/", {
    method: "POST",
    body: JSON.stringify({ doctor, clinic }),   
  });
};

export const getAssignments = async () => {
  const { id } = getClinic();
  return authedFetch(`/AccessControl/assigndoctortoclinic/${id}`);
};
export const deactivateAssignment = (id) =>
  authedFetch(`/AccessControl/assigndoctortoclinic/update/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ is_active: false }),
  });
