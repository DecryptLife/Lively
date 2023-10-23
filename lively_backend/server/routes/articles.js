require("dotenv").config();

const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const { User, Profile, Article } = require("../db");

const LIVELY_PRESET = process.env["LIVELY_PRESET"];
const cloudinary = require("../../config/cloudinary");

const db = mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function getArticles(req, res) {
  const currUser = req.username;
  if (!req.cookies) {
    console.log("no cookies");
    return res.sendStatus(401);
  }
  let pid = req.params.id;
  (async () => {
    const connector = mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await connector.then(() => {
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
        let users = [currUser];
        let followers = Profile.findOne({ username: currUser }, (err, docs) => {
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
    });
  })();
}

const updateArticles = asyncHandler(async (req, res) => {
  const pid = req.params.id;
  const text = req.body.text;
  const image = req.body.image;
  const author = req.username;
  const comment_id = req.body.comment_id;
  const currUser = req.username;

  var cloudUploadRes;
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

const addComment = (req, res) => {
  let pid = req.params.id;
  let currUser = req.username;
  let comment = req.body.comment;

  Articles.findOne({ pid: pid }, (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      if (docs) {
        let old_comments = docs["comments"];
        let new_comments = old_comments.concat(comment);
        Article.updateOne({ comments: new_comments }, (err, docs) => {
          if (err) {
            console.log(err);
          } else {
          }
        });
      }
    }
  });
};

const addArticle = asyncHandler(async (req, res) => {
  // const { body, name, image } = req.body;
  const text = req.body.text;
  const image = req.body.image;
  const loggedInUser = req.username;
  if (!text) {
    return res.status(200).send({ msg: "Text body not found" });
  }

  if (image) {
    console.log("Both image and text found");
    //Cloudinary
    var cloudUploadRes;
    try {
      cloudUploadRes = await cloudinary.uploader.upload(image, {
        upload_preset: LIVELY_PRESET,
      });
    } catch (error) {
      res.status(500);
      throw new Error("Some problem with cloudinary");
    }

    try {
      const newArticle = new Article({
        text: text,
        author: loggedInUser,
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
      const newArticle = await Article({
        text: text,
        author: loggedInUser,
        image: {
          url: "",
        },
        date: new Date().getTime(),
      });

      newArticle.save((err, docs) => {
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
  app.put("/articles/comments:id", addComment);
  app.post("/article", addArticle);
};

// const getArticles = (req, res) => {
//   const currUser = req.username;
//   if (!req.cookies) {
//     console.log("no cookies");
//     return res.sendStatus(401);
//   }
//   let pid = req.params.id;
//   (async () => {
//     const connector = mongoose.connect(connectionString, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     await connector.then(() => {
//       if (pid) {
//         let articles = [];
//         Article.find({ pid: pid }, (err, docs) => {
//           if (err) {
//             console.log(err);
//           } else {
//             if (docs.length > 0) {
//               articles = articles.concat(docs);
//             }

//             Article.find({ author: pid }, (err, docs) => {
//               if (err) {
//                 console.log(err);
//               } else {
//                 if (docs.length > 0) {
//                   articles = articles.concat(docs);
//                 }
//                 if (articles.length > 0) {
//                   res.send({ articles: articles });
//                 } else {
//                   res.status(200).send("No article with this id or author");
//                 }
//               }
//             });
//           }
//         });
//       } else {
//         let feed_articles = [];
//         let users = [currUser];
//         let followers = Profile.findOne({ username: currUser }, (err, docs) => {
//           if (err) {
//             console.log(err);
//           } else {
//             if (docs) {
//               users = users.concat(docs["following"]);
//               Article.find(
//                 { author: users },
//                 null,
//                 { sort: { date: -1 } },
//                 (err, docs) => {
//                   if (err) {
//                     console.log(err);
//                   } else {
//                     if (docs.length > 0) {
//                       res.send({ articles: docs });
//                     }
//                   }
//                 }
//               );
//             }
//           }
//         });
//       }
//     });
//   })();
// };

// const updateArticles = asyncHandler(async (req, res) => {
//   const pid = req.params.id;
//   const text = req.body.text;
//   const image = req.body.image;
//   const author = req.username;
//   const comment_id = req.body.comment_id;
//   const currUser = req.username;

//   var cloudUploadRes;
//   if (image) {
//     try {
//       cloudUploadRes = await cloudinary.uploader.upload(image, {
//         upload_preset: LIVELY_PRESET,
//       });
//     } catch (error) {
//       res.status(500);
//       throw new Error("Some problem with cloudinary");
//     }
//   }

//   if (comment_id) {
//     Article.findOne({ pid: pid }, (err, docs) => {
//       if (err) {
//         console.log(err);
//       } else {
//         if (docs) {
//           if (parseInt(comment_id) === -1) {
//             let new_comments = docs["comments"].concat(text);
//             Article.updateOne(
//               { pid: pid },
//               { comments: new_comments },
//               (err, docs) => {
//                 if (err) {
//                   console.log(err);
//                 } else {
//                   res.send({ msg: "success" });
//                 }
//               }
//             );
//           }
//           // comment id not -1 so modify the comment
//           else {
//             console.log("Comment id not -1");
//             let new_comments = docs["comments"];
//             if (new_comments.length < comment_id) {
//               return res
//                 .status(200)
//                 .send("Can't modify a comment that does not exist");
//             } else {
//               new_comments[parseInt(comment_id) - 1] = text;
//               Article.updateOne(
//                 { pid: pid },
//                 { comments: new_comments },
//                 (err, docs) => {
//                   if (err) {
//                     console.log(err);
//                   } else {
//                     res.send({ msg: "success" });
//                   }
//                 }
//               );
//             }
//           }
//         }
//       }
//     });
//   } else {
//     // first check if they own the post
//     Article.findOne({ pid: pid }, (err, docs) => {
//       if (err) {
//         console.log(err);
//       } else {
//         if (docs) {
//           if (docs["author"] === currUser) {
//             //update both text and image
//             if (text && image) {
//               console.log("Both image and text exists");

//               Article.updateOne(
//                 { pid: pid },
//                 { text: text, image: cloudUploadRes },
//                 (err, docs) => {
//                   if (err) {
//                     console.log(err);
//                   } else {
//                     res.send({ result: "success" });
//                   }
//                 }
//               );
//             }

//             //update image only
//             else if (image) {
//               // only images exists
//               console.log("only image exists");

//               Article.updateOne(
//                 { pid: pid },
//                 { image: cloudUploadRes },
//                 (err, docs) => {
//                   if (err) {
//                     console.log(err);
//                   } else {
//                     res.send({ msg: "success" });
//                   }
//                 }
//               );
//             }

//             // update text only
//             else if (text) {
//               console.log("only texts exists");
//               Article.updateOne({ pid: pid }, { text: text }, (err, docs) => {
//                 if (err) {
//                   console.log(err);
//                 } else {
//                   res.send({ msg: "success" });
//                 }
//               });
//             }
//           } else {
//             res.status(200).send({ msg: "Can't modify a post you don't own" });
//           }
//         }
//       }
//     });
//   }
// });

// const addComment = (req, res) => {
//   let pid = req.params.id;
//   let currUser = req.username;
//   let comment = req.body.comment;

//   Articles.findOne({ pid: pid }, (err, docs) => {
//     if (err) {
//       console.log(err);
//     } else {
//       if (docs) {
//         let old_comments = docs["comments"];
//         let new_comments = old_comments.concat(comment);
//         Article.updateOne({ comments: new_comments }, (err, docs) => {
//           if (err) {
//             console.log(err);
//           } else {
//           }
//         });
//       }
//     }
//   });
// };

// const addArticle = asyncHandler(async (req, res) => {
//   // const { body, name, image } = req.body;
//   const text = req.body.text;
//   const image = req.body.image;
//   const loggedInUser = req.username;
//   if (!text) {
//     return res.status(200).send({ msg: "Text body not found" });
//   }

//   if (image) {
//     console.log("Both image and text found");
//     //Cloudinary
//     var cloudUploadRes;
//     try {
//       cloudUploadRes = await cloudinary.uploader.upload(image, {
//         upload_preset: LIVELY_PRESET,
//       });
//     } catch (error) {
//       res.status(500);
//       throw new Error("Some problem with cloudinary");
//     }

//     try {
//       const newArticle = new Article({
//         text: text,
//         author: loggedInUser,
//         image: cloudUploadRes,
//         date: new Date().getTime(),
//       });

//       await newArticle.save((err, docs) => {
//         if (err) {
//           console.log(err);
//         } else {
//           res.status(200).json({ article: newArticle });
//         }
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(500);
//       throw new Error("Some Mongo Error occured");
//     }
//   } else {
//     console.log("Only text found");

//     try {
//       const newArticle = await Article({
//         text: text,
//         author: loggedInUser,
//         image: {
//           url: "",
//         },
//         date: new Date().getTime(),
//       });

//       newArticle.save((err, docs) => {
//         if (err) {
//           console.log(err);
//         } else {
//           res.status(200).json({ article: newArticle });
//         }
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(500);
//       throw new Error("Some Mongo Error occured");
//     }
//   }
// });
