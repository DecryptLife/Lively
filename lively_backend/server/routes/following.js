const app = require("express");
const { default: mongoose } = require("mongoose");

const { User, Profile, Article } = require("../db");

async function getFollowing(req, res) {
  // const username = req.params.user;
  const username = req.username;

  // no user given find the followers of logged in user
  const profile = await Profile({ username });

  if (profile) {
    if (profile["following"]) {
      let msg = { username: currUser, following: docs["following"] };
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
  let followers = profile["following"];

  if (profile) {
    const follower = await Profile.findOne({ username: follower_name });
    console.log(follower);
    if (follower) {
      followers.append(follower_name);
      const new_profile = await Profile.findOneAndUpdate(
        username,
        { following: followers },
        { new: true }
      );
      if (new_profile) {
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

  Profile.findOne({ username: currUser }, (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      let followers = docs["following"];
      if (followers.length > 0) {
        let followersDetails = [];
        Profile.find({ username: followers }, (err, docs) => {
          if (err) {
            console.log(err);
          } else {
            res.send({ followers: docs });
          }
        });
      }
    }
  });
}

module.exports = (app) => {
  app.put("/following/:user", addFollower);
  app.get("/following/:user?", getFollowing);
  app.get("/followersDetails", getFollowersDetails);
  app.delete("/following/:user", removeFollower);
};
