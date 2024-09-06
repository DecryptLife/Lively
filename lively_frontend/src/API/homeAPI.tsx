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

const getArticles = async (searchQuery = "") => {
  console.log("Get articles API: ", searchQuery);
  const params = searchQuery ? { search: searchQuery } : {};
  try {
    const res = await axios.get(`${BASE_URL}/articles`, { params });

    return res.data.articles;
  } catch (err) {
    console.log(err);
  }
};

const getHeadline = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/headline`);
    return res.data.headline;
  } catch (err: unknown) {
    if (err instanceof Error) console.log(err.message);
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

const updateStatus = async (new_headline: string) => {
  try {
    const res = await axios.put(`${BASE_URL}/headline`, new_headline);
    return res.data.headline;
  } catch (err: unknown) {
    if (err instanceof Error) console.log(err.message);
  }
};

const addPost = async (article: IArticle) => {
  try {
    const response = await axios.post(`${BASE_URL}/article`, article);

    return response.data.article;
  } catch (err: unknown) {
    if (err instanceof Error) console.log(err.message);
  }
};

const addComment = async (articleID: string, commentDetails: IComment) => {
  console.log("inside add comment");
  try {
    const response = await axios.post(
      `${BASE_URL}/articles/comments:${articleID}`,
      commentDetails
    );
  } catch (err: unknown) {
    if (err instanceof Error) console.log(err.message);
  }
};

const updateArticle = async (articleID: string, article: IArticle) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/articles/${articleID}`,
      article
    );

    return response.data.article;
  } catch (err: unknown) {
    if (err instanceof Error)
      console.log(`Update article error - ${err.message} :homeAPI.js`);
  }
};
const deleteArticle = async (articleID: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/articles/${articleID}`);

    console.log("Delete response: ", response);
    return response.data._id;
  } catch (err: unknown) {
    if (err instanceof Error) console.log("Delete API Error: ", err.message);
  }
};

export {
  getArticles,
  getUser,
  getHeadline,
  getAvatar,
  addPost,
  updateStatus,
  updateArticle,
  addComment,
  deleteArticle,
};
