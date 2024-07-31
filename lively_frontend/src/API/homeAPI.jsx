import axios from "axios";
import { BASE_URL } from "../config";
const getUser = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/userDetails`);
    // console.log(res.data.user);
    return res.data.user;
  } catch (err) {
    console.log(err);
  }
};

const getArticles = async () => {
  console.log("In get articles API");
  try {
    const res = await axios.get(`${BASE_URL}/articles`);
    console.log("Articles: ", res);
    return res.data.articles;
  } catch (err) {
    console.log(err);
  }
};

const getHeadline = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/headline`);
    console.log(res);
    return res.data.headline;
  } catch (err) {
    console.log(err.message);
  }
};

export { getArticles, getUser, getHeadline };
