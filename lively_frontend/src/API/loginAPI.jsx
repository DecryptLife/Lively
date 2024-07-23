import axios from "axios";
import { BASE_URL } from "../config";

export const loginUser = async (userDetails) => {
  return await axios(`${BASE_URL}/login`, userDetails, {
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    console.log("Login result: ", res);
  });
};
