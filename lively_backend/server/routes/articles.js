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

  try {
    await Profile.findById(userID, async (err, profile) => {
      if (err) {
        console.log("Caught here: ", err.message);
      } else {
        const followers = [username, ...profile.following];
        console.log("User followers: ", followers);

        const articles = await Article.find({
          author: { $in: followers },
        }).sort({ date: -1 });

        console.log("Articles backend: ", articles);

        res.status(200).send({ articles: articles });
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

const addArticle = async (req, res) => {
  const { text, post_image: image = "", author, author_image } = req.body;

  let cloudUploadRes;
  try {
    cloudUploadRes =
      image !== ""
        ? await cloudinary.uploader.upload(image, {
            upload_preset: LIVELY_PRESET,
          })
        : "";

    const newArticle = new Article({
      text,
      author,
      author_image,
      image: cloudUploadRes,
      date: new Date().getTime(),
    });

    const response = await newArticle.save();
    console.log("Add Response: ", response);
    res.status(200).send({ article: newArticle });
  } catch (error) {
    console.log("Error: ", error.message);
  }
};

module.exports = (app) => {
  app.get("/articles/:id?", getArticles);
  app.put("/articles/:id", updateArticles);
  app.post("/articles/comments:id", addComment);
  app.post("/article", addArticle);
};
