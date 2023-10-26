const app = require("express");
const { default: mongoose } = require("mongoose");

const { User, Profile, Article } = require("../db");

async function getFollowing(req, res) {
  const username = req.username;

  // no user given find the followers of logged in user
  const profile = await Profile.findOne({ username });

  if (profile) {
    if (profile["following"]) {
      let msg = { username, following: profile["following"] };
      res.send(msg);
    } else {
      return res.status(400).send("No followers for this user yet");
    }
  }
}

async function addFollower(req, res) {
  const follower_name = req.params.user;
  const username = req.username;

  if (username === follower_name) {
    return res.status(400).send("Can't follow the same user");
  }

  const profile = await Profile.findOne({ username });
  console.log("trying to add follower");
  if (profile) {
    let followers = profile["following"];
    console.log(`${profile["username"]} followers: ${followers}`);
    const follower = await Profile.findOne({ username: follower_name });
    if (follower) {
      console.log(`${follower["username"]} exists`);
      let following = followers.concat(follower_name);

      console.log(`${profile["username"]} followers: ${following}`);
      const new_profile = await Profile.findOneAndUpdate(
        { username: username },
        { following: following },
        {
          new: true,
        }
      );
      if (new_profile) {
        console.log("Follower successfully added");
        let msg = {
          username,
          following: new_profile["following"],
        };
        res.send(msg);
      }
    } else {
      return res.status(400).send("You can't follow an unregistered user");
    }
  }
}

async function removeFollower(req, res) {
  const follower_name = req.params.user;
  const username = req.username;

  const profile = await Profile.findOne({ username });

  if (profile) {
    const new_followers = profile["following"].filter(
      (follower) => follower !== follower_name
    );

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
  const username = req.username;
  const followers = req.body.followers;

  const profile = await Profile.findOne({ username });

  if (profile) {
    let followers = profile["following"];

    let details = [];

    followers.forEach(async (follower) => {
      const follower_profile = await Profile({ username: follower });
      if (follower_profile) details.concat(follower);
    });
    res.send({ followers: details });
  }
}

module.exports = (app) => {
  app.put("/following/:user", addFollower);
  app.get("/following/:user?", getFollowing);
  app.get("/followersDetails", getFollowersDetails);
  app.delete("/following/:user", removeFollower);
};
