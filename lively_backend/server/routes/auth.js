require("dotenv").config();
const express = require("express");

const { User, Profile, Article } = require("../db");

let sessionUser = {};
let cookieKey = "sid";
let userObjs = {};
const app = express();

const md5 = require("md5");

async function register(req, res) {
  console.log("checsjkskjdhs");
  console.log(req.body);
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
    const newUser = new User({ username, email, password, created });
    await newUser.save();
    const newUserProfile = new Profile({
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
  console.log("logging in");
  let exists_sid = req.cookies[cookieKey];
  let username = req.body.username;
  let pass = req.body.password;

  if (!username || !pass)
    return res.status(400).send("Missing username or password");
  let usern = userObjs[username];
  console.log("Jack: ", usern);

  let salt = username + "lively";
  let password = md5(salt + pass);

  const user = await User.findOne({ username, password });

  if (user) {
    let sid = md5(password + username);
    console.log("cookie being set: ", sid);
    res.cookie(cookieKey, sid, {
      maxAge: 3600 * 1000,
      sameSite: "None",
      httpOnly: true,
      secure: true,
    });
    sessionUser[sid] = username;
    req.username = username;
    let msg = { result: "success", cookie: sid };
    return res.status(200).json(msg);
  } else {
    return res.status(400).json({ result: "User does not exist" });
  }
}

function isLoggedIn(req, res, next) {
  if (!req.cookies) {
    console.log("no cookies");
    return res.sendStatus(401);
  }

  let sid = req.cookies[cookieKey];
  // no sid for cookie key
  if (!sid) {
    return res.sendStatus(401);
  } else {
    console.log("user exists");
    let username = sessionUser[sid];
    console.log("username: ", username);
    if (username) {
      req.username = username;
      next();
    } else {
      return res.sendStatus(401);
    }
  }
}

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
  app.use(isLoggedIn);
  app.put("/password", changePassword);
  app.put("/logout", logout);
};
