const dotenv = require("dotenv");
dotenv.config();
const asyncHandler = require("express-async-handler");

const { User, Profile, Article } = require("../db");
const { LIVELY_PRESET } = require("../../config");

// const LIVELY_PRESET = process.env.LIVELY_PRESET;
const cloudinary = require("../../config/cloudinary");

console.log(LIVELY_PRESET);
async function getArticles(req, res) {
  console.log("get articles");
  console.log("Req header: ", req.user.username);
  const username = req.user.username;
  let pid = req.params.id;

  if (!req.cookies) {
    console.log("no cookies");
    return res.sendStatus(401);
  }

  const articles = await Article.find({ author: username });

  if (pid) {
    let articles = [];
    Article.find({ pid: pid }, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        if (docs.length > 0) {
          articles = articles.concat(docs);
        }

        Article.find({ author: pid }, (err, docs) => {
          if (err) {
            console.log(err);
          } else {
            if (docs.length > 0) {
              articles = articles.concat(docs);
            }
            if (articles.length > 0) {
              res.send({ articles: articles });
            } else {
              res.status(200).send("No article with this id or author");
            }
          }
        });
      }
    });
  } else {
    let feed_articles = [];
    let users = [username];
    let followers = Profile.findOne({ username }, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        if (docs) {
          users = users.concat(docs["following"]);
          Article.find(
            { author: users },
            null,
            { sort: { date: -1 } },
            (err, docs) => {
              if (err) {
                console.log(err);
              } else {
                if (docs.length > 0) {
                  res.send({ articles: docs });
                }
              }
            }
          );
        }
      }
    });
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
  let comment = req.body.comment;

  const articles = await Article.findById(pid);

  console.log("Article test: ", articles);

  if (articles) {
    let comments = articles["comments"];
    let new_comments = comments.concat(comment);

    await Article.findByIdAndUpdate(
      pid,
      { comments: new_comments },
      { new: true }
    );
  }
}

const addArticle = asyncHandler(async (req, res) => {
  // const { body, name, image } = req.body;
  console.log(req.user);

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
