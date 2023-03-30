require("dotenv").config();

const { default: mongoose } = require("mongoose");
const asyncHandler = require("express-async-handler");
const profileSchema = require("./src/profileSchema");
const userSchema = require("./src/userSchema");
const Profile = mongoose.model("profile", profileSchema);
const User = mongoose.model("user", userSchema);
const md5 = require("md5");
const LIVELY_PRESET = process.env["LIVELY_PRESET"];
const cloudinary = require("./config/cloudinary");
const getHeadline = (req, res) => {
  console.log("BRO ");
  var username = req.params.user;
  var currUser = req.username;
  if (username) {
    Profile.findOne({ username: username }, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        if (!docs) {
          return res.status(400).send("This user does not exist");
        } else {
          let msg = { username: docs["username"], headline: docs["headline"] };
          res.send(msg);
        }
      }
    });
  } else {
    Profile.findOne({ username: currUser }, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        let msg = { username: docs["username"], headline: docs["headline"] };
        res.send(msg);
      }
    });
  }

  // this return the requested user headline
  // res.send({ username: profile["username"], headline: profile["headline"] });
};

const updateHeadline = (req, res) => {
  console.log("Here buddy");
  console.log("COO: ", res.cookies);
  const new_headline = req.body.headline;
  const currUser = req.username;
  if (!new_headline) {
    return res.status(400).send("Please provide a headline to update");
  }
  const username = req.username;
  Profile.updateOne(
    { username: currUser },
    { headline: new_headline },
    (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        let msg = { username: username, headline: new_headline };
        res.send(msg);
      }
    }
  );
};

const getEmail = (req, res) => {
  const username = req.params.user;
  const currentUser = req.username;
  if (!username) {
    Profile.findOne({ username: currentUser }, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        let msg = { username: currentUser, email: docs["email"] };
        res.send(msg);
      }
    });
  } else {
    Profile.findOne({ username: username }, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        if (!docs) {
          return res.status(400).send("User does not exist");
        } else {
          let msg = { username: username, email: docs["email"] };
          res.send(msg);
        }
      }
    });
  }
};

const updateEmail = (req, res) => {
  const currUser = req.username;
  const new_email = req.body.email;
  Profile.updateOne(
    { username: currUser },
    { email: new_email },
    (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        let msg = { username: currUser, email: new_email };
        res.send(msg);
      }
    }
  );
};

const getDOB = (req, res) => {
  const username = req.params.user;
  const currUser = req.username;

  if (!username) {
    Profile.findOne({ username: currUser }, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        let msg = { username: currUser, dob: docs["dob"] + "ms" };
        res.send(msg);
      }
    });
  } else {
    Profile.findOne({ username: username }, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        if (!docs) {
          return res.status(400).send("User does not exist");
        } else {
          let msg = { username: username, dob: docs["dob"] + "ms" };
          res.send(msg);
        }
      }
    });
  }
};

const getZipCode = (req, res) => {
  const username = req.params.user;
  const currUser = req.username;

  if (!username) {
    Profile.findOne({ username: currUser }, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        let msg = { username: currUser, zipcode: docs["zipcode"] };
        res.send(msg);
      }
    });
  } else {
    Profile.findOne({ username: username }, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        if (!docs) {
          return res.status(400).send("User does not exist");
        } else {
          let msg = { username: username, zipcode: docs["zipcode"] };
          res.send(msg);
        }
      }
    });
  }
};

const updateZipCode = (req, res) => {
  const currUser = req.username;
  const new_zipcode = req.body.zipcode;

  if (!new_zipcode) {
    return res.status(400).send("New zip code not given");
  }

  Profile.updateOne(
    { username: currUser },
    { zipcode: new_zipcode },
    (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        let msg = { username: currUser, zipcode: new_zipcode };
        res.send(msg);
      }
    }
  );
};

const getAvatar = (req, res) => {
  const loggedInUser = req.username;

  Profile.findOne({ user: loggedInUser }, (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      console.log(docs);
      let msg = { avatar: docs["avatar"] };
      res.send(msg);
    }
  });

  // console.log(user);

  // res.status(200);
  // res.json({ username: loggedInUser.username, avatar: user.avatar });
};

const updateAvatar = asyncHandler(async (req, res) => {
  const loggedInUser = req.username;

  //Here, req.body will contain the base_64 encoded image string as 'avatar'
  // console.log("Req.body: Base 64 encoded image string: ", req.body.avatar);
  // console.log("AVATAR: ", req.body);
  //Cloudinary
  var cloudUploadRes;
  try {
    cloudUploadRes = await cloudinary.uploader.upload(req.body.avatar, {
      upload_preset: LIVELY_PRESET,
    });
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error("Some problem with cloudinary");
  }
  console.log(cloudUploadRes);
  //Saving cloudinary res in avatar
  try {
    const updatedUser = await Profile.findOneAndUpdate(
      { username: loggedInUser },
      { avatar: cloudUploadRes },
      { new: true }
    );

    res.status(200);
    res.json({
      username: loggedInUser.username,
      avatar: updatedUser.avatar,
    });
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error("Some problem while updating Image");
  }
});

// const updateAvatar = (req, res) => {
//   let new_avatar = "https://www.gstatic.com/webp/gallery/4.sm.jpg";
//   let currUser = req.username;

//   Profile.updateOne(
//     { username: currUser },
//     { avatar: new_avatar },
//     (err, docs) => {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log("Avater changed successfully");
//         Profile.findOne({ username: currUser }, (err, docs) => {
//           if (err) {
//             console.log(err);
//           } else {
//             let msg = { username: currUser, avatar: docs["avatar"] };
//             res.send(msg);
//           }
//         });
//       }
//     }
//   );
// };

const getUserDetails = (req, res) => {
  let currUser = req.username;

  Profile.findOne({ username: currUser }, (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      if (docs) {
        let msg = { user: docs };
        res.send(msg);
      }
    }
  });
};

const updateDetails = (req, res) => {
  let u_email = req.body.email;
  let u_mobile = req.body.mobile;
  let u_dob = req.body.dob;
  let u_zipcode = req.body.zipcode;
  let u_password = req.body.password;
  let currUser = req.username;
  User.updateOne({ username: currUser }, { email: u_email }, (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      Profile.updateOne(
        { username: currUser },
        {
          email: u_email,
          dob: u_dob,
          mobile: u_mobile,
          zipcode: u_zipcode,
        },
        (err, docs) => {
          if (err) {
            console.log(err);
          } else {
            if (u_password) {
              let salt = currUser + "lively";
              let hash = md5(salt + u_password);
              User.updateOne(
                { username: currUser },
                { password: hash },
                (err, docs) => {
                  if (err) {
                    console.log(err);
                  } else {
                    Profile.findOne({ username: currUser }, (err, docs) => {
                      if (err) {
                        console.log(err);
                      } else {
                        if (docs) {
                          res.send({ user: docs });
                        }
                      }
                    });
                  }
                }
              );
            } else {
              Profile.findOne({ username: currUser }, (err, docs) => {
                if (err) {
                  console.log(err);
                } else {
                  if (docs) {
                    let msg = { user: docs };
                    res.send(msg);
                  }
                }
              });
            }
            console.log("profile details updated");
          }
        }
      );
    }
  });
};

module.exports = (app) => {
  app.put("/updateDetails", updateDetails);
  app.get("/headline/:user?", getHeadline);
  app.put("/headline", updateHeadline);
  app.get("/email/:user?", getEmail);
  app.put("/email", updateEmail);
  app.get("/dob/:user?", getDOB);
  app.get("/zipcode/:user?", getZipCode);
  app.put("/zipcode", updateZipCode);
  app.get("/avatar/:user?", getAvatar);
  app.get("/userDetails", getUserDetails);
  app.put("/avatar", updateAvatar);
};
