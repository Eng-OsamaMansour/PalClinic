import { BASE_URL } from "../config/Config";
import { getAccessToken } from "../config/TokenManager";
import { getValidAccessToken } from "../config/ValidAccessToken";
getValidAccessToken;

export const getMedicalProfile = async (patientId) => {
  const response = await fetch(`${BASE_URL}/MedicalProfile/${patientId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getValidAccessToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch medical profile");
  }

  return response.json();
};
