import { BASE_URL } from "../config/Config";

export const getClinics = () => {

    const response = fetch(`${BASE_URL}/clinic/`,{
        method: 'GET',
        headers:{
            "Content-Type": "application/json"
        }
    });

    if (!response.ok){
        throw new Error("Failed to fetch Clinics");
    }

    return response.json();

}