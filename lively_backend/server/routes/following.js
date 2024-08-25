const app = require("express");
const mongoose = require("mongoose");
const { User, Profile, Article } = require("../db");

// async function getFollowing(req, res) {
//   const username = req.user.username;

//   // no user given find the followers of logged in user
//   const profile = await Profile.findOne({ username });

//   if (profile) {
//     const followersID = profile["following"].map((follower) => follower._id);
//     const followers_details = await Profile.find({
//       _id: { $in: followersID },
//     });

//     if (followers_details) {
//       let msg = { following: followers_details };
//       res.status(200).send(msg);
//     } else {
//       return res.status(400).send("No followers for this user yet");
//     }
//   }
// }

async function getFollowersByID(req, res) {
  // if (profile) {
  //   const followersID = profile["following"].map((follower) => follower._id);
  //   const followers_details = await Profile.find({
  //     _id: { $in: followersID },
  //   });
  //   if (followers_details) {
  //     let msg = { following: followers_details };
  //     res.status(200).send(msg);
  //   } else {
  //     return res.status(400).send("No followers for this user yet");
  //   }
  // }

  console.log("ID list: ", req.user);
  const userID = req.user.id;

  try {
    const profile = await Profile.findById(userID);
    const followerDetails = await Profile.find(
      {
        _id: { $in: profile.following },
      },
      "username avatar _id"
    );

    res.status(200).send({ followers: followerDetails });
  } catch (err) {
    console.log("Get followers by id error: ", err.message);
  }
}

async function addFollower(req, res) {
  const followerName = req.params.follower;
  const userID = req.user.id;

  try {
    const followerDetails = await Profile.findOne({ username: followerName });
    const { _id } = followerDetails;

    const userProfile = await Profile.findById(userID);
    const userFollowers = userProfile.following;

    const followerID = mongoose.Types.ObjectId(_id);
    const newFollowers = [...userFollowers, followerID];

    const modifiedProfile = await Profile.findByIdAndUpdate(
      userID,
      {
        following: newFollowers,
      },
      { new: true }
    );

    res.status(200).send({ following: modifiedProfile.following });
  } catch (err) {
    console.log("Error: ", err.message);
  }
}

async function removeFollower(req, res) {
  const followerID = req.params.followerID;
  const userID = req.user.id;

  try {
    const profile = await Profile.findById(userID);

    const new_followers = profile["following"].filter(
      (follower) => follower._id.toString() !== followerID
    );

    const new_profile = await Profile.findByIdAndUpdate(
      userID,
      {
        following: new_followers,
      },
      { new: true }
    );

    if (new_profile) {
      let msg = { following: new_profile.following };
      res.send(msg);
    }
  } catch (err) {
    console.log("Error: ", err.message);
  }
}

async function getFollowersDetails(req, res) {
  const username = req.user.username;
  const profile = await Profile.findOne({ username });

  if (profile) {
    let followers = profile["following"];
    let details = [];

    const follower_details = await Profile.find({
      username: { $in: followers },
    });

    if (follower_details) {
      res.send({ followers: follower_details });
    } else {
      res.status(500).send(error);
    }
  }
}

module.exports = (app) => {
  app.patch("/following/:follower?", addFollower);
  // app.get("/following/:user?", getFollowing);
  app.get("/following", getFollowersByID);
  app.get("/followersDetails", getFollowersDetails);
  app.delete("/following/:followerID?", removeFollower);
};
