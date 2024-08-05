import axios from "axios";
import { BASE_URL } from "../config";

const updateProfile = async (userID, newDetails) => {
  console.log("User ID: ", userID);
  console.log("New details: ", newDetails);
  const updatedDetails = { userID, ...newDetails };

  //   updatedDetails["userID"] = userID;
  //   for (let [key, value] of Object.entries(newDetails)) {
  //     if (value !== "") updatedDetails[key] = value;
  //   }

  console.log("Updated details: ", updatedDetails);

  try {
    const response = await axios.patch(
      `${BASE_URL}/userDetails`,
      updatedDetails
    );
    return response;
  } catch (err) {
    console.log(err.message);
  }
};

export { updateProfile };
