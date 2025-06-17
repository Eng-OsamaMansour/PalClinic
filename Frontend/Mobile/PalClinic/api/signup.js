import { BASE_URL } from "../config/Config";

const signin = async (email, password, name, phoneNumber, confirm_password) => {
  const response = await fetch(`${BASE_URL}/Users/signUp/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      name,
      phoneNumber,
      confirm_password,
      role: "patient",
    }),
  });

  return response;
};

export default signin;
