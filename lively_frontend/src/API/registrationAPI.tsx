import axios from "axios";
import { BASE_URL } from "../config";

export const registerUser = async (userDetails: IRegistration<string>) => {
  try {
    await axios.post(`${BASE_URL}/register`, userDetails);
  } catch (err: unknown) {
    if (err instanceof Error)
      console.log("Register User Error API: " + err.message);
  }
};
