import { BASE_URL } from "../config";
import axios from "axios";

export const registerUser = async (userDetails) => {
  return axios.post(`${BASE_URL}/register`, userDetails, {
    headers: { "Content-Type": "application/json" },
  });
};
