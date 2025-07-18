import { BASE_URL } from "../config/Config";
import { getUser } from "../config/UserManager";
import { getValidAccessToken } from "../config/ValidAccessToken";


export const getDoctorsRequsets = async () => {
  const { id } = await getUser();
  const response = await fetch(
    `${BASE_URL}/AccessControl/access_requst/get/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getValidAccessToken()}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch  Doctors Requests");
  }

  return response.json();
};

export const updateRequest = async (request) => {
  const payload = request.is_active
    ? { status: "rejected", is_active: false }
    : { status: "accepted", is_active: true };

  const response = await fetch(
    `${BASE_URL}/AccessControl/access_request/update/${request.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getValidAccessToken()}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update");
  }

  return response;
};

export const deleteRequest = async (request) => {

  const response = await fetch(
    `${BASE_URL}/AccessControl/access_request/delete/${request.id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getValidAccessToken()}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to DELETE");
  }

  return response ;
};
