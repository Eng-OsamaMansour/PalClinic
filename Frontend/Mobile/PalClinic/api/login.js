import { BASE_URL } from "../config/config"; // Adjust path as needed

const login = async (email, password) => {
  const response = await fetch(`${BASE_URL}/Users/signIn/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return response;
};

export default login;
