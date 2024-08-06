const app = require("express");

const { User, Profile, Article } = require("../db");

async function getFollowing(req, res) {
  const username = req.user.username;

  // no user given find the followers of logged in user
  const profile = await Profile.findOne({ username });

  if (profile) {
    const followersID = profile["following"].map((follower) => follower._id);
    // console.log("Followers IDs: ", followersID);
    const followers_details = await Profile.find({
      _id: { $in: followersID },
    });

    if (followers_details) {
      let msg = { following: followers_details };

      // console.log("Follower details: ", msg);
      res.status(200).send(msg);
    } else {
      return res.status(400).send("No followers for this user yet");
    }
  }
}

async function addFollower(req, res) {
  const followerName = req.params.follower;
  const userID = req.user.id;

  try {
    const followerDetails = await Profile.findOne({ username: followerName });
    const { _id, username, avatar } = followerDetails;

    const userProfile = await Profile.findById(userID);
    const userFollowers = userProfile.following;

    const newFollowers = [...userFollowers, { _id, username, avatar }];
    const modifiedProfile = await Profile.findByIdAndUpdate(
      userID,
      {
        following: newFollowers,
      },
      { new: true }
    );

    console.log("Modified profile: ", modifiedProfile);

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

    console.log("New followers: ", new_followers);

    const new_profile = await Profile.findByIdAndUpdate(
      userID,
      {
        following: new_followers,
      },
      { new: true }
    );

    console.log("After removal: ", new_profile);

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
  app.get("/following/:user?", getFollowing);
  app.get("/followersDetails", getFollowersDetails);
  app.delete("/following/:followerID?", removeFollower);
};
