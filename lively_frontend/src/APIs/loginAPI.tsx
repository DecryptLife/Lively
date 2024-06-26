import axios from "axios";
import { BASE_URL } from "../config";

export const loginUser = async (userDetails) => {
  return await axios.post(`${BASE_URL}/login`, userDetails, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
