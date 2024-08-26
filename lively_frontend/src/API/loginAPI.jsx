import axios from "axios";
import { BASE_URL } from "../config";

export const loginUser = async (userDetails) => {
  console.log("In login user API: ", userDetails);
  try {
    await axios
      .post(`${BASE_URL}/login`, userDetails, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("Login result: ", res);
      });
  } catch (err) {
    console.log("Login error: " + err.message);
  }
};

export const logoutUser = async () => {
  return await axios.put(`${BASE_URL}/logout`).then((res) => {
    console.log("User logged out: ", res.message);
  });
};
