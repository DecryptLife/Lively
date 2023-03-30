const mongoose = require("mongoose");
const userSchema = require("./userSchema");
const profileSchema = require("./profileSchema");
const Profile = mongoose.model("profile", profileSchema);
const User = mongoose.model("user", userSchema);
const connectionString =
  "mongodb+srv://bt22:xQ8BdgzsZt1f1iwc@cluster0.9auii05.mongodb.net/lively?retryWrites=true&w=majority";
const REDIS_URL =
  "redis://:pd2ab0292dfca79eb5c1cbd30297384c1ed16e10da40daf823b0f92562eca1310@ec2-3-230-185-236.compute-1.amazonaws.com:19529";
const redis = require("redis").createClient(REDIS_URL);

let sessionUser = {};
let cookieKey = "sid";
let userObjs = {};

const md5 = require("md5");

function isLoggedIn(req, res, next) {
  console.log("Authenticated: ", req.isAuthenticated());
  if (!req.cookies) {
    return res.sendStatus(401);
  }
  if (req.isAuthenticated()) {
    req.username = req.user.name;
    console.log("It is authenticated");
    next();
  } else {
    console.log("It is not authenticated");
    let sid = req.cookies[cookieKey];
    // no sid for cookie key
    if (!sid) {
      return res.sendStatus(401);
    }

    let username = sessionUser[sid];
    if (username) {
      req.username = username;
      next();
    } else {
      return res.sendStatus(401);
    }
  }
}

function register(req, res) {
  let username = req.body.username;
  let email = req.body.email;
  let headline = "Please update your headline";
  let dob = req.body.dob;
  let mobile = req.body.mobile;
  let zipcode = req.body.zipcode;
  let password = req.body.password;
  let avatar = req.body.avatar;
  if (!username || !email || !dob || !zipcode || !password || !headline)
    return res.status(400).send("Missing required parameters");

  if (!avatar) avatar = "https://www.gstatic.com/webp/gallery3/1.sm.png";
  let salt = username + "lively";
  // var date = new Date(dob);
  // var ms = date.getTime().toString();
  let hash = md5(salt + password);

  (async () => {
    const connector = mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    var createdTime = new Date().getTime();

    let user = new User({
      username: username,
      password: hash,
      email: email,
      created: createdTime,
    });

    let user_profile = new Profile({
      username: username,
      email: email,
      headline: headline,
      mobile: mobile,
      dob: dob,
      zipcode: zipcode,
      avatar: avatar,
      created: createdTime,
    });

    await connector.then(() => {
      User.findOne({ username: user["username"] }, (err, docs) => {
        if (err) {
          console.log(err);
        } else {
          if (docs) {
            return res
              .status(200)
              .send({ msg: "User with this username already exists" });
          } else {
            user.save((err, docs) => {
              if (err) {
                console.log(err);
              } else {
                console.log("User added to database successfully");
                user_profile.save((err, docs) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("Profile created for user");
                  }
                });

                let msg = { result: "success", username: username };
                res.send(msg);
              }
            });
          }
        }
      });
    });
  })();
}

const login = (req, res) => {
  console.log("logging in");
  let exists_sid = req.cookies[cookieKey];

  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password)
    return res.status(400).send("Missing username or password");

  let user = userObjs[username];
  console.log("Jack: ", user);
  (async () => {
    const connector = mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await connector.then(() => {
      // salt the password
      // check if the username and password matches
      let salt = username + "lively";
      let hash = md5(salt + password);

      User.findOne({ username: username }, (err, docs) => {
        if (err) console.log(err);
        else {
          if (docs) {
            let userDetails = docs;
            if (
              userDetails["username"] == username &&
              userDetails["password"] == hash
            ) {
              let sid = md5(hash + username);
              if (exists_sid && sid != exists_sid) {
                return res.status(400).send("Logout to login again");
              } else {
                // redis.hSet("sessions", sid, username);
                // console.log(redis.hGetAll("sessions", sid));

                console.log("cookie being set: ", sid);
                res.cookie(cookieKey, sid, {
                  maxAge: 3600 * 1000,
                  sameSite: "None",
                  httpOnly: true,
                  secure: true,
                });
                // res.setHeader("Set-Cookie", sid);
                Profile.findOne({ username: username }, (err, docs) => {
                  if (err) {
                    console.log(err);
                  } else {
                    if (docs) {
                      sessionUser[sid] = username;
                      let msg = {
                        username: docs["username"],
                        email: docs["email"],
                        headline: docs["headline"],
                        dob: docs["dob"],
                        mobile: docs["mobile"],
                        zipcode: docs["zipcode"],
                        avatar: docs["avatar"],
                        following: docs["following"],
                        result: "success",
                        cookie: sid,
                      };
                      res.send(msg);
                    }
                  }
                });
              }
            } else {
              let msg = { result: "Invalid credentials" };
              res.send(msg);
            }
          } else {
            res.send({ result: "User does not exist" });
          }
        }
      });
    });
  })();
};

const changePassword = (req, res) => {
  if (!req.cookies) {
    return res.sendStatus(401);
  }
  let sid = req.cookies[cookieKey];

  let username = sessionUser[sid];
  const new_password = req.body.password;
  let salt = username + "lively";
  let hash = md5(salt + new_password);

  if (!new_password) return res.status(400).send("New password not given");

  User.updateOne({ username: username }, { password: hash }, (err, docs) => {
    if (err) console.log(err);
    else {
      let msg = { username: username, result: "success" };
      res.send(msg);
    }
  });
};

const logout = (req, res) => {
  // if (!req.cookies) return res.sendStatus(401);
  // let sid = req.cookies[cookieKey];
  if (req.isAuthenticated()) {
    req.logOut();
  }
  console.log("Clearing cookie");
  // if (!req.cookies) return res.sendStatus(401);

  res.clearCookie(cookieKey, { sameSite: "none", secure: true });
  // delete sessionUser(sid);
  let msg = "OK";
  res.send(msg);
  res.end();
};

module.exports = (app) => {
  app.post("/register", register);
  app.post("/login", login);
  app.use(isLoggedIn);
  app.put("/password", changePassword);
  app.put("/logout", logout);
};
