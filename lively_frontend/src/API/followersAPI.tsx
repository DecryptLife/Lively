import axios from "axios";
import { BASE_URL } from "../config";

const getFollowers = async (followerIDs: Array<string>) => {
  try {
    const response = await axios.get(`${BASE_URL}/following`, followerIDs);

    return response.data.followers;
  } catch (err: unknown) {
    if (err instanceof Error) console.log("Error: ", err.message);
  }
};

const addFollower = async (newFriend) => {
  try {
    const response = await axios.patch(`${BASE_URL}/following/${newFriend}`);

    return response.data.following;
  } catch (err: unknown) {
    if (err instanceof Error) console.log("Error: ", err.message);
  }
};

const removeFriend = async (friendID: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/following/${friendID}`);

    return response.data.following;
  } catch (err: unknown) {
    if (err instanceof Error) console.log("Error: ", err.message);
  }
};

export { addFollower, getFollowers, removeFriend };
