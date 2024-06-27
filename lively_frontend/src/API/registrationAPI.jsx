import axios from "axios";
import { BASE_URL } from "../config";

export const registerUser = async (userDetails) => {
  return await axios(`${BASE_URL}/register`, userDetails, {
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    console.log("Registration result: ", res);
  });
};
