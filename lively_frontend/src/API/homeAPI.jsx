import axios from "axios";
import { BASE_URL } from "../config";
const getUser = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/userDetails`);
    return res.data.user;
  } catch (err) {
    console.log(err);
  }
};

const getArticles = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/articles`);

    return res.data.articles;
  } catch (err) {
    console.log(err);
  }
};

const getHeadline = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/headline`);
    return res.data.headline;
  } catch (err) {
    console.log(err.message);
  }
};

const getAvatar = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/avatar`);
    return response.data.avatar;
  } catch (err) {
    console.log(err);
  }
};

const updateStatus = async (new_headline) => {
  try {
    const res = await axios.put(`${BASE_URL}/headline`, new_headline);
    return res.data.headline;
  } catch (err) {
    console.log(err);
  }
};

const addPost = async (article) => {
  try {
    const response = await axios.post(`${BASE_URL}/article`, article);

    return response.data.article;
  } catch (err) {
    console.log(err.message);
  }
};

const addComment = async (articleID, commentDetails) => {
  console.log("inside add comment");
  try {
    const response = await axios.post(
      `${BASE_URL}/articles/comments:${articleID}`,
      commentDetails
    );
  } catch (err) {
    console.log(err.message);
  }
};

const deleteArticle = async (articleID) => {
  try {
    const response = await axios.delete(`${BASE_URL}/articles/${articleID}`);

    console.log("Delete response: ", response);
    return response.data._id;
  } catch (err) {
    console.log("Delete API Error: ", err.message);
  }
};

export {
  getArticles,
  getUser,
  getHeadline,
  getAvatar,
  addPost,
  updateStatus,
  addComment,
  deleteArticle,
};
