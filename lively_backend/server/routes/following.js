const app = require("express");
const { default: mongoose } = require("mongoose");

const profileSchema = require("./src/profileSchema");
const Profile = mongoose.model("profile", profileSchema);

const getFollowing = (req, res) => {
  const username = req.params.user;
  const currUser = req.username;

  // no user given find the followers of logged in user
  if (!username) {
    Profile.findOne({ username: currUser }, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        if (docs["following"].length > 0) {
          let msg = { username: currUser, following: docs["following"] };
          res.send(msg);
        } else {
          return res.status(400).send("No followers for this user yet");
        }
      }
    });
  }
  // user is provided, find followers of that user
  else {
    Profile.findOne({ username: username }, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        if (docs["following"].length > 0) {
          let msg = { username: username, following: docs["following"] };
          res.send(msg);
        } else {
          let msg = { following: docs["following"] };
          return res.send(msg);
        }
      }
    });
  }
};

const addFollower = (req, res) => {
  console.log("adding follower");
  const username = req.params.user;
  const currUser = req.username;
  if (!username) {
    return res.status(400).send("No user given");
  }
  if (username === currUser) {
    return res.status(400).send("Can't follow the same user");
  }

  Profile.findOne({ username: currUser }, (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      var followers = docs["following"];
      if (followers.includes(username)) {
        return res.status(400).send("You are already following this user");
      } else {
        Profile.findOne({ username: username }, (err, docs) => {
          if (err) {
            console.log(err);
          } else {
            if (docs) {
              Profile.findOne({ username: currUser }, (err, docs) => {
                if (err) {
                  console.log(err);
                } else {
                  let new_followers = docs["following"];

                  new_followers = new_followers.concat(username);

                  Profile.updateOne(
                    { username: currUser },
                    { following: new_followers },
                    (err, docs) => {
                      if (err) {
                        console.log(err);
                      } else {
                        let msg = {
                          username: currUser,
                          following: new_followers,
                        };
                        res.send(msg);
                      }
                    }
                  );
                }
              });
            } else {
              return res
                .status(400)
                .send("You can't follow an unregistered user");
            }
          }
        });
      }
    }
  });
};

const removeFollower = (req, res) => {
  console.log("removing follower");
  const username = req.params.user;
  const currUser = req.username;

  if (!username) {
    return res.status(400).send("No user mentioned");
  }

  Profile.findOne({ username: currUser }, (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      let followers = docs["following"];
      if (!followers.includes(username)) {
        return res.status(400).send("Can't delete a user not being followed");
      } else {
        let new_followers = followers.filter(removeUser);
        function removeUser(follower) {
          return follower != username;
        }

        Profile.updateOne(
          { username: currUser },
          { following: new_followers },
          (err, docs) => {
            if (err) {
              console.log(err);
            } else {
              let msg = { username: currUser, following: new_followers };
              res.send(msg);
            }
          }
        );
      }
    }
  });
};

const getFollowersDetails = (req, res) => {
  const currUser = req.username;
  const followers = req.body.followers;
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
};

module.exports = (app) => {
  app.put("/following/:user", addFollower);
  app.get("/following/:user?", getFollowing);
  app.get("/followersDetails", getFollowersDetails);
  app.delete("/following/:user", removeFollower);
};
