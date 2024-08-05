require("dotenv").config();

const { default: mongoose } = require("mongoose");

const asyncHandler = require("express-async-handler");

const { Profile } = require("../db");

const { LIVELY_PRESET } = require("../../config");
const cloudinary = require("../../config/cloudinary");

async function getHeadline(req, res) {
  const userID = req.user.id;

  try {
    const profile = await Profile.findById(userID);

    if (profile) {
      let msg = {
        username: profile["username"],
        headline: profile["headline"],
      };
      res.status(200).send(msg);
    }
  } catch (err) {
    console.log("Error: ", err.message);
  }
}

async function updateHeadline(req, res) {
  const new_headline = req.body.headline;
  const userID = req.user.id;

  if (!new_headline) {
    return res.status(400).send("Please provide a headline to update");
  }

  try {
    const profile = await Profile.findByIdAndUpdate(userID, {
      headline: new_headline,
    });

    if (profile) {
      let msg = { headline: new_headline };
      res.send(msg);
    }
  } catch (err) {
    console.log("Error: ", err.message);
  }
}

async function getAvatar(req, res) {
  const userID = req.user.id;

  try {
    const profile = await Profile.findById(userID);

    if (profile) {
      res.status(200).send({ avatar: profile["avatar"] });
    }
  } catch (err) {
    console.log("Error: ", err.message);
  }
}

const updateAvatar = asyncHandler(async (req, res) => {
  const userID = req.user.id;
  const image = req.body.avatar;

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

      const updatedUser = await Profile.findByIdAndUpdate(userID, {
        avatar: cloudUploadRes["url"],
      });
      res.status(200).send({ username: username, avatar: updatedUser.avatar });
    } catch (error) {
      onsole.log("Error: ", err.message);
    }
  }
});

async function getUserDetails(req, res) {
  let userID = req.user.id;

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
  let { userID, name: username, ...values } = req.body;
  values["username"] = username;
  let updatedDetails = {};

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

module.exports = (app) => {
  app.get("/headline/:user?", getHeadline);
  app.put("/headline", updateHeadline);
  // app.get("/email/:user?", getEmail);
  // app.put("/email", updateEmail);
  // app.get("/dob/:user?", getDOB);
  // app.get("/zipcode/:user?", getZipCode);
  // app.put("/zipcode", updateZipCode);
  app.get("/avatar/:user?", getAvatar);
  app.get("/userDetails", getUserDetails);
  app.patch("/userDetails", updateDetails);
  app.put("/avatar", updateAvatar);
};
