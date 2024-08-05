const dotenv = require("dotenv");
dotenv.config();
const asyncHandler = require("express-async-handler");

const { Profile, Article } = require("../db");
const { LIVELY_PRESET } = require("../../config");

// const LIVELY_PRESET = process.env.LIVELY_PRESET;
const cloudinary = require("../../config/cloudinary");

async function getArticles(req, res) {
  const username = req.user.username;
  const userID = req.user.id;
  // let pid = req.params.id;

  // const articles = await Article.find({ author: username });

  let feed_articles = [];
  let userList = [];
  try {
    await Profile.findById(userID, async (err, profile) => {
      if (err) {
      } else {
        const followers = [username, ...profile.following];
        console.log("User followers: ", followers);

        const articles = await Promise.all(
          followers.map(async (follower) => {
            const followerArticles = await Article.find({ author: follower });
            return followerArticles;
          })
        );

        console.log("Followed articles: ", articles);

        // flatten articles
        const flattened_articles = articles.flat();
        console.log("Fallttened: ", flattened_articles);
        res.status(200).send({ articles });
      }
    });
  } catch (err) {
    console.log("Error: ", err.message);
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
            console.log("Comment id not -1");
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
              console.log("Both image and text exists");

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
              console.log("only image exists");

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
              console.log("only texts exists");
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
  console.log("In add comment");
  let pid = req.params.id.replace(/^:/, "");
  console.log("Post id: ", pid);

  console.log("Body: ", req.body);
  const comment = req.body;

  const article = await Article.findById(pid);

  // console.log("Article test: ", articles);

  if (article) {
    console.log("Article found: ", article);

    // prepare the comment content

    let prevComments = article["comments"];
    console.log("Previous: ", prevComments);

    let updatedComments = prevComments.concat(comment);
    console.log("Updated comments: ", updatedComments);

    try {
      const response = await Article.findByIdAndUpdate(
        pid,
        { comments: updatedComments },
        { new: true }
      );
      console.log("Comment added: ", response);
      res.status(200).send({ msg: "success" });
    } catch (err) {
      console.log("error adding the comment");
    }
  }
}

const addArticle = asyncHandler(async (req, res) => {
  // const { body, name, image } = req.body;
  // console.log(req.user);
  // console.log(req.body);

  const { text, post_image: image, author, author_image } = req.body;

  const loggedInUser = req.username;
  if (!text) {
    return res.status(200).send({ msg: "Text body not found" });
  }

  if (image) {
    console.log("Both image and text found");
    console.log("Preset: ", LIVELY_PRESET);
    //Cloudinary
    let cloudUploadRes;
    try {
      cloudUploadRes = await cloudinary.uploader.upload(image, {
        upload_preset: LIVELY_PRESET,
      });
    } catch (error) {
      console.log("error: ", error);
      res.status(500);
      throw new Error("Some problem with cloudinary: ", error.message);
    }

    try {
      const newArticle = new Article({
        text,
        author,
        author_image,
        image: cloudUploadRes,
        date: new Date().getTime(),
      });

      await newArticle.save((err, docs) => {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json({ article: newArticle });
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500);
      throw new Error("Some Mongo Error occured");
    }
  } else {
    console.log("Only text found");

    try {
      const newArticle = new Article({
        text: text,
        author: loggedInUser,
        image: {
          url: "",
        },
        date: new Date().getTime(),
      });

      await newArticle.save((err, docs) => {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json({ article: newArticle });
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500);
      throw new Error("Some Mongo Error occured");
    }
  }
});

module.exports = (app) => {
  app.get("/articles/:id?", getArticles);
  app.put("/articles/:id", updateArticles);
  app.post("/articles/comments:id", addComment);
  app.post("/article", addArticle);
};
