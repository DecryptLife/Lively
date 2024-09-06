import axios from "axios";
import { BASE_URL } from "../config";

const updateProfile = async (userID, newDetails) => {
  const updatedDetails = { userID, ...newDetails };

  try {
    const response = await axios.patch(
      `${BASE_URL}/userDetails`,
      updatedDetails
    );

    return response.data;
  } catch (err) {
    console.log(err.message);
  }
};

export { updateProfile };
