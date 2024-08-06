const app = require("express");

const { User, Profile, Article } = require("../db");

async function getFollowing(req, res) {
  console.log("In get following");
  const username = req.user.username;

  // no user given find the followers of logged in user
  const profile = await Profile.findOne({ username });

  if (profile) {
    const followersID = profile["following"].map((follower) => follower._id);

    const followers_details = await Profile.find({
      _id: { $in: followersID },
    });

    if (followers_details) {
      console.log("follower details: ", followers_details);
      let msg = { username, following: followers_details };
      res.send(msg);
    } else {
      return res.status(400).send("No followers for this user yet");
    }
  }
}

async function addFollower(req, res) {
  console.log("In add follower function");
  const followerName = req.params.follower;
  const userID = req.user.id;

  try {
    const followerDetails = await Profile.findOne({ username: followerName });
    const { _id, username, avatar } = followerDetails;

    console.log("Follower received: ", { _id, username, avatar });

    const userProfile = await Profile.findById(userID);
    console.log("User profile: ", userProfile);
    const userFollowers = userProfile.following;

    console.log("Users followers: ", userFollowers);

    const newFollowers = [...userFollowers, { _id, username, avatar }];

    console.log("New followers: ", newFollowers);

    const modifiedProfile = await Profile.findByIdAndUpdate(userID, {
      following: newFollowers,
    });

    res.status(200).send({ following: modifiedProfile.following });
  } catch (err) {
    console.log("Error: ", err.message);
  }
}

async function removeFollower(req, res) {
  const follower_name = req.params.user;
  const username = req.user.username;

  const profile = await Profile.findOne({ username });
  console.log("Follower to remove: ", follower_name);
  if (profile) {
    console.log(`${profile["username"]}'s profile`);
    const new_followers = profile["following"].filter(
      (follower) => follower !== follower_name
    );

    console.log("New Followers: ", new_followers);

    const new_profile = await Profile.findOneAndUpdate(
      username,
      { following: new_followers },
      { new: true }
    );

    if (new_profile) {
      let msg = { username, following: new_profile["following"] };
      res.send(msg);
    }
  }
}

async function getFollowersDetails(req, res) {
  const username = req.user.username;
  const profile = await Profile.findOne({ username });

  if (profile) {
    console.log("profile: ", profile);
    let followers = profile["following"];
    console.log("followers: ", followers);
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
  app.patch("/following/:follower", addFollower);
  app.get("/following/:user?", getFollowing);
  app.get("/followersDetails", getFollowersDetails);
  app.delete("/following/:user", removeFollower);
};
