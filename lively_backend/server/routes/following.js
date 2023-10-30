const app = require("express");

const { User, Profile, Article } = require("../db");

async function getFollowing(req, res) {
  const username = req.username;

  // no user given find the followers of logged in user
  const profile = await Profile.findOne({ username });

  if (profile) {
    const followers = profile["following"];

    const followers_details = await Profile.find({
      username: { $in: followers },
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
  const username = req.username;
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
  app.put("/following/:user", addFollower);
  app.get("/following/:user?", getFollowing);
  app.get("/followersDetails", getFollowersDetails);
  app.delete("/following/:user", removeFollower);
};
