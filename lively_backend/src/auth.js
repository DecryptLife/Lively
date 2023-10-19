require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userSchema = require("./userSchema");
const profileSchema = require("./profileSchema");
const Profile = mongoose.model("profile", profileSchema);
const User = mongoose.model("user", userSchema);

let sessionUser = {};
let cookieKey = "sid";
let userObjs = {};
const router = express.Router();

const md5 = require("md5");

router.use((req, res, next) => {
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
});

router.post("/register", async (req, res) => {
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
  let hash = md5(salt + password);

  let createdTime = new Date().getTime();

  const user = await User.findOne({ username });

  if (user) {
    res.status(403).json({ message: "User already exists" });
  } else {
    const newUser = new User({ username, hash, email, createdTime });
    await newUser.save();
    const newUserProfile = new Profile({
      username,
      email,
      headline,
      mobile,
      dob,
      zipcode,
      avatar,
      createdTime,
    });
    await newUserProfile.save();
    res.json({ message: "User created successfully" });
  }
});

module.exports = router;

// const login = (req, res) => {
//   console.log("logging in");
//   let exists_sid = req.cookies[cookieKey];

//   let username = req.body.username;
//   let password = req.body.password;

//   if (!username || !password)
//     return res.status(400).send("Missing username or password");

//   let user = userObjs[username];
//   console.log("Jack: ", user);
//   (async () => {
//     const connector = mongoose.connect(connectionString, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     await connector.then(() => {
//       // salt the password
//       // check if the username and password matches
//       let salt = username + "lively";
//       let hash = md5(salt + password);

//       User.findOne({ username: username }, (err, docs) => {
//         if (err) console.log(err);
//         else {
//           if (docs) {
//             let userDetails = docs;
//             if (
//               userDetails["username"] == username &&
//               userDetails["password"] == hash
//             ) {
//               let sid = md5(hash + username);
//               if (exists_sid && sid != exists_sid) {
//                 return res.status(400).send("Logout to login again");
//               } else {
//                 // redis.hSet("sessions", sid, username);
//                 // console.log(redis.hGetAll("sessions", sid));

//                 console.log("cookie being set: ", sid);
//                 res.cookie(cookieKey, sid, {
//                   maxAge: 3600 * 1000,
//                   sameSite: "None",
//                   httpOnly: true,
//                   secure: true,
//                 });
//                 // res.setHeader("Set-Cookie", sid);
//                 Profile.findOne({ username: username }, (err, docs) => {
//                   if (err) {
//                     console.log(err);
//                   } else {
//                     if (docs) {
//                       sessionUser[sid] = username;
//                       let msg = {
//                         username: docs["username"],
//                         email: docs["email"],
//                         headline: docs["headline"],
//                         dob: docs["dob"],
//                         mobile: docs["mobile"],
//                         zipcode: docs["zipcode"],
//                         avatar: docs["avatar"],
//                         following: docs["following"],
//                         result: "success",
//                         cookie: sid,
//                       };
//                       res.send(msg);
//                     }
//                   }
//                 });
//               }
//             } else {
//               let msg = { result: "Invalid credentials" };
//               res.send(msg);
//             }
//           } else {
//             res.send({ result: "User does not exist" });
//           }
//         }
//       });
//     });
//   })();
// };

// console.log("heck 6");

// const changePassword = (req, res) => {
//   if (!req.cookies) {
//     return res.sendStatus(401);
//   }
//   let sid = req.cookies[cookieKey];

//   let username = sessionUser[sid];
//   const new_password = req.body.password;
//   let salt = username + "lively";
//   let hash = md5(salt + new_password);

//   if (!new_password) return res.status(400).send("New password not given");

//   User.updateOne({ username: username }, { password: hash }, (err, docs) => {
//     if (err) console.log(err);
//     else {
//       let msg = { username: username, result: "success" };
//       res.send(msg);
//     }
//   });
// };

// const logout = (req, res) => {
//   // if (!req.cookies) return res.sendStatus(401);
//   // let sid = req.cookies[cookieKey];
//   if (req.isAuthenticated()) {
//     req.logOut();
//   }
//   console.log("Clearing cookie");
//   // if (!req.cookies) return res.sendStatus(401);

//   res.clearCookie(cookieKey, { sameSite: "none", secure: true });
//   // delete sessionUser(sid);
//   let msg = "OK";
//   res.send(msg);
//   res.end();
// };

// // module.exports = (app) => {
// //   app.post("/register", register);
// //   app.post("/login", login);
// //   app.use(isLoggedIn);
// //   app.put("/password", changePassword);
// //   app.put("/logout", logout);
// // };
