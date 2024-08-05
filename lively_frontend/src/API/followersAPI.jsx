import axios from "axios";
import { BASE_URL } from "../config";

const getFollowers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/followersDetails`);

    console.log("Followers API: followers - ", response);
  } catch (err) {
    console.log("Error: ", err.message);
  }
};

const addFollower = async (newFriend) => {
  try {
    const response = await axios.patch(`${BASE_URL}/following/${newFriend}`);
    console.log("Followers API: ", response);
  } catch (err) {
    console.log("Error: ", err.message);
  }
};

export { addFollower, getFollowers };
