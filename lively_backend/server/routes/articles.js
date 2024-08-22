const dotenv = require("dotenv");
dotenv.config();
const asyncHandler = require("express-async-handler");

const { Profile, Article } = require("../db");
const { LIVELY_PRESET } = require("../../config");

// const LIVELY_PRESET = process.env.LIVELY_PRESET;
const cloudinary = require("../../config/cloudinary");
const { Mongoose, default: mongoose } = require("mongoose");

async function getArticles(req, res) {
  const username = req.user.username;
  const userID = req.user.id;

  try {
    Profile.findById(userID, async (err, profile) => {
      if (err) {
        console.log("Error: ", err.message);
      } else {
        const followers = profile.following.map(
          (follower) => follower.username
        );

        // console.log("Followers: ", followers);
        const articleAuthors = [username, ...followers];

        // console.log("All authors: ", articleAuthors);

        const articles = await Article.find({
          author: { $in: articleAuthors },
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
  const pid = req.params.id;
  const text = req.body.text;
  const image = req.body.image;
  const author = req.username;
  const comment_id = req.body.comment_id;
  const currUser = req.username;

  let cloudUploadRes;
  if (image) {
    try {
      cloudUploadRes = await cloudinary.uploader.upload(image, {
        upload_preset: LIVELY_PRESET,
      });
    } catch (error) {
      res.status(500);
      throw new Error("Some problem with cloudinary");
    }
  }

  if (comment_id) {
    Article.findOne({ pid: pid }, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        if (docs) {
          if (parseInt(comment_id) === -1) {
            let new_comments = docs["comments"].concat(text);
            Article.updateOne(
              { pid: pid },
              { comments: new_comments },
              (err, docs) => {
                if (err) {
                  console.log(err);
                } else {
                  res.send({ msg: "success" });
                }
              }
            );
          }
          // comment id not -1 so modify the comment
          else {
            let new_comments = docs["comments"];
            if (new_comments.length < comment_id) {
              return res
                .status(200)
                .send("Can't modify a comment that does not exist");
            } else {
              new_comments[parseInt(comment_id) - 1] = text;
              Article.updateOne(
                { pid: pid },
                { comments: new_comments },
                (err, docs) => {
                  if (err) {
                    console.log(err);
                  } else {
                    res.send({ msg: "success" });
                  }
                }
              );
            }
          }
        }
      }
    });
  } else {
    // first check if they own the post
    Article.findOne({ pid: pid }, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        if (docs) {
          if (docs["author"] === currUser) {
            //update both text and image
            if (text && image) {
              Article.updateOne(
                { pid: pid },
                { text: text, image: cloudUploadRes },
                (err, docs) => {
                  if (err) {
                    console.log(err);
                  } else {
                    res.send({ result: "success" });
                  }
                }
              );
            }

            //update image only
            else if (image) {
              // only images exists

              Article.updateOne(
                { pid: pid },
                { image: cloudUploadRes },
                (err, docs) => {
                  if (err) {
                    console.log(err);
                  } else {
                    res.send({ msg: "success" });
                  }
                }
              );
            }

            // update text only
            else if (text) {
              Article.updateOne({ pid: pid }, { text: text }, (err, docs) => {
                if (err) {
                  console.log(err);
                } else {
                  res.send({ msg: "success" });
                }
              });
            }
          } else {
            res.status(200).send({ msg: "Can't modify a post you don't own" });
          }
        }
      }
    });
  }
});

async function addComment(req, res) {
  let pid = req.params.id.replace(/^:/, "");
  const comment = req.body;

  const article = await Article.findById(pid);

  if (article) {
    // prepare the comment content

    let prevComments = article["comments"];

    let updatedComments = prevComments.concat(comment);

    try {
      const response = await Article.findByIdAndUpdate(
        pid,
        { comments: updatedComments },
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
    cloudUploadRes =
      image !== ""
        ? await cloudinary.uploader.upload(image, {
            upload_preset: LIVELY_PRESET,
          })
        : "";

    const postID = new mongoose.Types.ObjectId();
    const newArticle = new Article({
      _id: postID,
      text,
      authorID: userID,
      image: cloudUploadRes,
      date: new Date().getTime(),
    });

    const response = await newArticle.save();

    console.log("New Post: ", response);
    res.status(200).send({ article: response });
  } catch (error) {
    console.log("Error: ", error.message);
  }
};

const deleteArticle = async (req, res) => {
  const postID = req.params.id;

  console.log("Article to be deleted: ", postID);

  Article.findByIdAndDelete(postID, (err, docs) => {
    if (err) {
      console.log("Post Delete Error: ", err.message);
    } else {
      console.log("Deleted: ", docs);
      res.status(200).send(docs);
    }
  });
};

module.exports = (app) => {
  app.get("/articles/:id?", getArticles);
  app.put("/articles/:id", updateArticles);
  app.post("/articles/comments:id", addComment);
  app.post("/article", addArticle);
  app.delete("/articles/:id?", deleteArticle);
};
