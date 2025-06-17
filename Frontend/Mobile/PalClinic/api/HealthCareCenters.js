import { BASE_URL } from "../config/Config";


export const getHealthCareCenters = () => {

    const response = fetch(`${BASE_URL}/healthcarecenter/`,{
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })

    if (!response.ok){
        throw new Error("Failed to Featch Health Care Centers");
    }

    return response.json();

}