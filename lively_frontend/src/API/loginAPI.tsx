import { BASE_URL } from "../config";
import axios from "axios";

interface LoginDetails {
  username: string;
  password: string;
}

export const loginUser = async (userDetails: LoginDetails) => {
  console.log("In login user API: ", userDetails);
  try {
    await axios.post(`${BASE_URL}/login`, userDetails, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) console.log("Login error: " + err.message);
  }
};

export const logoutUser = async () => {
  return await axios.put(`${BASE_URL}/logout`).then((res) => {
    console.log("User logged out: ", res);
  });
};
