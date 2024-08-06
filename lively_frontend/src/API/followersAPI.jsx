import axios from "axios";
import { BASE_URL } from "../config";

const getFollowers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/following`);

    console.log("Followers API: followers - ", response);
  } catch (err) {
    console.log("Error: ", err.message);
  }
};

const addFollower = async (newFriend) => {
  try {
    const response = await axios.patch(`${BASE_URL}/following/${newFriend}`);
    console.log("Followers API: ", response.data);
    return response.data.following;
  } catch (err) {
    console.log("Error: ", err.message);
  }
};

const removeFriend = async (friendID) => {
  try {
    const response = await axios.delete(`${BASE_URL}/following/${friendID}`);

    console.log("Remove friend: ", response);

    return response.data.following;
  } catch (err) {
    console.log("Error: ", err.message);
  }
};

export { addFollower, getFollowers, removeFriend };
