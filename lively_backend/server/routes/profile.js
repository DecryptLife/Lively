require("dotenv").config();

const { default: mongoose } = require("mongoose");

const asyncHandler = require("express-async-handler");

const { User, Profile, Article } = require("../db");

const md5 = require("md5");

const { LIVELY_PRESET } = require("../../config");
const cloudinary = require("../../config/cloudinary");

async function getHeadline(req, res) {
  const username = req.user.username;

  const profile = await Profile.findOne({ username });

  if (profile) {
    let msg = { username: profile["username"], headline: profile["headline"] };
    res.send(msg);
  }
}

async function updateHeadline(req, res) {
  const new_headline = req.body.headline;
  const username = req.user.username;
  if (!new_headline) {
    return res.status(400).send("Please provide a headline to update");
  }
  console.log(req.user.username);
  const profile = await Profile.findOneAndUpdate(
    { username: req.user.username },
    { headline: req.body.headline },
    {
      new: true,
    }
  );

  if (profile) {
    let msg = { username, headline: new_headline };
    res.send(msg);
  }
}

async function getEmail(req, res) {
  const username = req.user.username;

  const profile = await Profile.findOne({ username });

  if (profile) {
    let msg = { username: username, email: profile["email"] };
    res.send(msg);
  }
}

async function updateEmail(req, res) {
  const username = req.user.username;
  const email = req.body.email;

  const profile = await Profile.findOneAndUpdate(username, email, {
    new: true,
  });

  if (profile) {
    let msg = { username: currUser, email: new_email };
    res.send(msg);
  }
}

async function getDOB(req, res) {
  const username = req.user.username;

  const profile = await Profile.findOne({ username });

  if (profile) {
    let msg = { username: username, dob: docs["dob"] + "ms" };
    res.send(msg);
  }
}

async function getZipCode(req, res) {
  const username = req.user.username;

  const profile = await Profile.findOne({ username });

  if (profile) {
    let msg = { username: username, zipcode: docs["zipcode"] };
    res.send(msg);
  }
}

async function updateZipCode(req, res) {
  if (!new_zipcode) {
    return res.status(400).send("New zip code not given");
  }

  const profile = await Profile.findOneAndUpdate(req.user.username, req.body, {
    new: true,
  });

  if (profile) {
    let msg = { username: currUser, zipcode: new_zipcode };
    res.send(msg);
  }
}

async function getAvatar(req, res) {
  const username = req.user.username;
  console.log("avatar", username);
  const profile = await Profile.findOne({ username });

  if (profile) {
    res.json({ avatar: profile["avatar"] });
  }
}

const updateAvatar = asyncHandler(async (req, res) => {
  const username = req.user.username;
  const image = req.body.avatar;

  console.log("image: ", image);
  //Here, req.body will contain the base_64 encoded image string as 'avatar'
  // console.log("Req.body: Base 64 encoded image string: ", req.body.avatar);
  // console.log("AVATAR: ", req.body);
  //Cloudinary

  if (image) {
    if (typeof image !== "string")
      throw new Error("Image is not fo the type String");

    let cloudUploadRes;
    try {
      cloudUploadRes = await cloudinary.uploader.upload(image, {
        upload_preset: LIVELY_PRESET,
      });
      console.log(cloudUploadRes);
      console.log("uploading to cloudinary");
    } catch (error) {
      console.log(cloudUploadRes);
      console.log(error);
      res.status(500);
      throw new Error("Some problem with cloudinary");
    }
    console.log(cloudUploadRes);
    //Saving cloudinary res in avatar
    try {
      const updatedUser = await Profile.findOneAndUpdate(
        { username: username },
        { avatar: cloudUploadRes["url"] },
        { new: true }
      );

      console.log("updating the user avatar");
      res.status(200);
      res.json({
        username: username,
        avatar: updatedUser.avatar,
      });
    } catch (error) {
      console.log(error);
      res.status(500);
      throw new Error("Some problem while updating Image");
    }
  }
});

async function getUserDetails(req, res) {
  console.log("In get user details");
  // console.log(req);
  // console.log("Req user: ", req);
  let userID = req.user.id;

  console.log(userID);

  try {
    const profile = await Profile.findById(userID);

    console.log("Profile: ", profile);

    if (profile) {
      console.log("Before");
      let msg = { user: profile };
      console.log("Msg: ", msg);
      res.send(msg);
    }
  } catch (err) {
    console.log(err.message);
  }
}

async function updateDetails(req, res) {
  console.log(req.body);
  let { userID, name: username, ...values } = req.body;
  values["username"] = username;
  let updatedDetails = {};
  console.log("Values: ", values);
  for (const [key, value] of Object.entries(values)) {
    if (value !== "") updatedDetails[key] = value;
  }

  try {
    console.log("Updated values: ", updatedDetails);
    const profile = await Profile.findByIdAndUpdate(userID, updatedDetails, {
      new: true, // Return the updated document
      runValidators: true, // Ensure the update adheres to the schema
    });

    console.log("Profile: ", profile);

    return res.status(200).send({ ...profile });
  } catch (err) {
    console.log(err.message);
  }
}

// for (let [key, value] of Object.entries()) {
// }

// const profile = await Profile.findOne(
//   username,
//   {
//     email,
//     dob,
//     mobile,
//     zipcode,
//   },
//   { new: true }
// );

// if (user && profile) {
//   res.json({ user: profile });
// }

module.exports = (app) => {
  app.get("/headline/:user?", getHeadline);
  app.put("/headline", updateHeadline);
  app.get("/email/:user?", getEmail);
  app.put("/email", updateEmail);
  app.get("/dob/:user?", getDOB);
  app.get("/zipcode/:user?", getZipCode);
  app.put("/zipcode", updateZipCode);
  app.get("/avatar/:user?", getAvatar);
  app.get("/userDetails", getUserDetails);
  app.patch("/userDetails", updateDetails);
  app.put("/avatar", updateAvatar);
};
