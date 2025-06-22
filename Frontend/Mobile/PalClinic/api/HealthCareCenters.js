import { BASE_URL } from "../config/Config";
import { getValidAccessToken } from "../config/ValidAccessToken";


export const getHealthCareCenters = async () => {
  const response = await fetch(`${BASE_URL}/healthcarecenter/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch health-care centers (${response.status} ${response.statusText})`
    );
  }

  return response.json(); 
};


export const getHealthCareCenterClinics = async (center_id) => {
  const response = await fetch(`${BASE_URL}/healthcarecenter/${center_id}/clinics/`,{
        method: "GET",
        headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getValidAccessToken()}`,
    },
    })

    if (!response.ok){
       throw new Error(
      `Failed to fetch health-care center clinics (${response.status} ${response.statusText})`
    );
    }

    return response.json();
}