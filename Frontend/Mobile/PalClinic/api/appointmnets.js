import { BASE_URL } from "../config/Config";
import { getValidAccessToken } from "../config/ValidAccessToken";

const getAppointments = async () => {
  const token = await getValidAccessToken();

  console.log(token);
  if (!token) throw new Error("Unauthorized");

  const response = await fetch(`${BASE_URL}/appointment/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

const cancelAppointment = async (appointmentId) => {
  const token = await getValidAccessToken();

  if (!token) throw new Error("Unauthorized");

  const response = await fetch(
    `${BASE_URL}/appointment/unbook/${appointmentId}/`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to cancel appointment");
  }

  return response.json();
};



const getClinicAppointments = async (clinic_id) => {
  const token = await getValidAccessToken();

  if (!token) throw new Error("Unauthorized");
  const response = await fetch(`${BASE_URL}/appointment/${clinic_id}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to Get appointments");
  }
  return response.json();
};
export { getAppointments, cancelAppointment,getClinicAppointments };