const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const isVerified = require("../middleware/isVerified");

const { User, Profile, Article } = require("../db");

const app = express();

const md5 = require("md5");
const { default: mongoose } = require("mongoose");
dotenv.config();
console.log("Inside auth route");

async function register(req, res) {
  let username = req.body.username;
  let email = req.body.email;
  let headline = "Please update your headline";
  let dob = req.body.dob;
  let mobile = req.body.mobile;
  let zipcode = req.body.zipcode;
  let pass = req.body.password;
  let avatar = req.body.avatar;
  if (!username || !email || !dob || !zipcode || !pass || !headline)
    return res.status(400).send("Missing required parameters");

  if (!avatar) avatar = "https://www.gstatic.com/webp/gallery3/1.sm.png";
  let salt = username + "lively";
  let password = md5(salt + pass);

  let created = new Date().getTime();

  const user = await User.findOne({ username });

  if (user) {
    console.log("user already exists");
    res.status(403).json({ message: "User already exists" });
  } else {
    console.log("No user exists");
    const userID = new mongoose.Types.ObjectId();

    console.log("ID new: ", userID);
    const newUser = new User({
      _id: userID,
      username,
      email,
      password,
      created,
    });
    await newUser.save();
    const newUserProfile = new Profile({
      _id: userID,
      username,
      email,
      headline,
      dob,
      mobile,
      zipcode,
      avatar,
    });
    await newUserProfile.save();
    console.log("user created");
    res.json({ message: "User created successfully" });
  }
}

async function login(req, res) {
  console.log("Inside login");
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).send("Missing username or password");

  let salt = username + "lively";
  let hashed_password = md5(salt + password);

  const user = await User.findOne({ username, hashed_password });

  console.log("User details: ", user);

  if (user) {
    console.log(
      `ID: ${user.id}, name: ${user.username}, secret: ${process.env.JWT_SECRET}`
    );
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
      maxAge: 3600000,
    });

    // res.cookie(cookieKey, sid, {
    //   maxAge: 3600 * 1000,
    //   sameSite: "None",
    //   httpOnly: true,
    //   secure: true,
    // });

    res.status(200).json({ message: "Login successful" });
  } else {
    return res.status(400).json({ result: "User does not exist" });
  }
}

// function isLoggedIn(req, res, next) {
//   if (!req.cookies) {
//     console.log("no cookies");
//     return res.sendStatus(401);
//   }

//   console.log("cookie: ", req.headers.authorization);
//   let sid = req.cookies[cookieKey];
//   // no sid for cookie key
//   // console.log("req: ", req);
//   console.log("req.cookies: ", req.cookies);
//   console.log("checking here: cookie key -", cookieKey);
//   console.log("checking sid: ", sid);
//   if (!sid) {
//     return res.sendStatus(401);
//   } else {
//     console.log("user exists");
//     let username = sessionUser[sid];
//     console.log("username: ", username);
//     if (username) {
//       req.username = username;
//       next();
//     } else {
//       return res.sendStatus(401);
//     }
//   }
// }

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
  if (!req.cookies) return res.sendStatus(401);
  // let sid = req.cookies[cookieKey];
  if (req.isAuthenticated()) {
    req.logOut();
  }
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
  app.use(isVerified);
  app.put("/password", changePassword);
  app.put("/logout", logout);
};
