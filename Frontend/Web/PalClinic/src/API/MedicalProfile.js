import { BASE_URL } from "../Config/Urls";
import { getValidAccessToken } from "../Config/ValidAccessToken";

export async function api(path, methodOrOpts, maybeBody) {
  let opts;
  if (typeof methodOrOpts === "string") {
    opts = { method: methodOrOpts };
    if (maybeBody !== undefined) opts.body = maybeBody;
  } else if (methodOrOpts instanceof FormData) {

    opts = { method: "POST", body: methodOrOpts };
  } else if (typeof methodOrOpts === "object") {

    opts = { ...methodOrOpts };
  } else {

    opts = { method: "GET" };
  }

  const token = await getValidAccessToken();
  if (!token) throw new Error("No valid token");
  opts.headers = {
    ...(opts.headers || {}),
    Authorization: `Bearer ${token}`,
  };


  if (
    opts.body &&
    !(opts.body instanceof FormData) &&
    !opts.headers["Content-Type"]
  ) {
    opts.headers["Content-Type"] = "application/json";
    if (typeof opts.body !== "string") opts.body = JSON.stringify(opts.body);
  }


  const res = await fetch(`${BASE_URL}${path}`, opts);

  const isJson = res.headers
    .get("content-type")
    ?.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok)
    throw new Error(data?.detail || `Error ${res.status}: ${res.statusText}`);

  return data;
}


export const getProfile = (patientId) => api(`/MedicalProfile/${patientId}`);

export const postTreatment = (patientId, payload) =>
  api(`/MedicalProfile/treatment/${patientId}`, "POST", payload);

export const postSurgery = (patientId, formData /* FormData */) =>
  api(`/MedicalProfile/surgery/${patientId}`, formData);

export const postLabTest = (patientId, formData /* FormData */) =>
  api(`/MedicalProfile/lab_test/${patientId}`, formData);

export const postDoctorNote = (patientId, payload) =>
  api(`/MedicalProfile/doctor_note/${patientId}`, "POST", payload);

