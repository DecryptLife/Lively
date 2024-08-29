const dotenv = require("dotenv");
dotenv.config();
const asyncHandler = require("express-async-handler");
const { Profile, Article } = require("../db");
const { Mongoose, default: mongoose } = require("mongoose");
const cloudinaryUpload = require("../utils/cloudinaryUpload");

async function getArticles(req, res) {
  const userID = req.user.id;

  try {
    Profile.findById(userID, async (err, profile) => {
      if (err) {
        console.log("Error: ", err.message);
      } else {
        const followers = profile.following;

        const articleAuthors = [profile._id, ...followers];

        const articles = await Article.find({
          authorID: { $in: articleAuthors },
        })
          .populate("authorID", "username avatar")
          .sort({ date: -1 });

        const fromattedArticles = articles.map((article) => {
          return {
            ...article.toObject(),
            author: article.authorID.username,
            avatar: article.authorID.avatar,
            authorID: article.authorID._id,
          };
        });

        res.status(200).send({ articles: fromattedArticles });
      }
    });
  } catch (err) {
    console.log("Articles Error: ", err.message);
  }
}

const updateArticles = asyncHandler(async (req, res) => {
  const articleID = req.params.id;
  const updatedDetails = req.body;

  let cloudUploadRes;
  if (updatedDetails.image) {
    if (typeof updatedDetails.image !== "string")
      throw new Error("Image is not fo the type String");

    try {
      cloudUploadRes = await cloudinaryUpload(updatedDetails.image);
    } catch (error) {
      res.status(500);
      throw new Error("Some problem with cloudinary: ", error.message);
    }
  }

  const modifiedArticle = {
    ...(updatedDetails.text && { text: updatedDetails.text }),
    ...(updatedDetails.image && { image: cloudUploadRes }),
  };

  try {
    const newArticle = await Article.findByIdAndUpdate(
      articleID,
      {
        $set: modifiedArticle,
      },
      { new: true }
    );

    if (newArticle) {
      return res.status(200).send({ article: newArticle });
    } else {
      res.status(500);
      throw new Error("Article update failed");
    }
  } catch (err) {
    console.log(`Article update error: ${err.message} :articles.js`);
  }
});

async function addComment(req, res) {
  let pid = req.params.id.replace(/^:/, "");
  const comment = req.body;

  const article = await Article.findById(pid);

  if (article) {
    let prevComments = article["commentsID"];

    let updatedComments = prevComments.concat(comment);
    try {
      const response = await Article.findByIdAndUpdate(
        pid,
        { commentsID: updatedComments },
        { new: true }
      );

      res.status(200).send({ msg: "success" });
    } catch (err) {
      console.log("error adding the comment");
    }
  }
}

const addArticle = async (req, res) => {
  const userID = req.user.id;
  const { text, post_image: image = "" } = req.body;

  let cloudUploadRes;
  try {
    cloudUploadRes = image !== "" ? await cloudinaryUpload(image) : "";

    const postID = new mongoose.Types.ObjectId();
    const authorID = new mongoose.Types.ObjectId(req.user.id);

    const newArticle = new Article({
      _id: postID,
      text,
      authorID,
      image: cloudUploadRes,
      date: new Date().getTime(),
    });

    const savedArticle = await newArticle.save();

    const populatedArticle = await savedArticle.populate(
      "authorID",
      "username avatar"
    );

    const formattedArticle = {
      ...populatedArticle.toObject(),
      author: populatedArticle.authorID.username,
      avatar: populatedArticle.authorID.avatar,
      authorID: populatedArticle.authorID._id,
    };

    res.status(200).send({ article: formattedArticle });
  } catch (error) {
    console.log("Error: ", error.message);
  }
};

const deleteArticle = async (req, res) => {
  const postID = req.params.id;

  Article.findByIdAndDelete(postID, (err, docs) => {
    if (err) {
      console.log("Post Delete Error: ", err.message);
    } else {
      res.status(200).send(docs);
    }
  });
};

module.exports = (app) => {
  app.get("/articles/:id?", getArticles);
  app.patch("/articles/:id", updateArticles);
  app.post("/articles/comments:id", addComment);
  app.post("/article", addArticle);
  app.delete("/articles/:id?", deleteArticle);
};
