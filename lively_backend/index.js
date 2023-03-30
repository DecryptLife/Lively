require("dotenv").config();

const profile = require("./profile");
const following = require("./following");
const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const userSchema = require("./src/userSchema");
const auth = require("./src/auth");
const articles = require("./articles");
const User = mongoose.model("user", userSchema);
const path = require("path");
const { type } = require("os");
var session = require("express-session");
var passport = require("passport");
const router = express.Router();
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000",
  // preflightContinue: false,
  // origin: "*",
  "Access-Control-Allow-Origin": "*",
  credentials: true,
};

const connectionString =
  "mongodb+srv://bt22:xQ8BdgzsZt1f1iwc@cluster0.9auii05.mongodb.net/lively?retryWrites=true&w=majority";
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(
  session({
    secret: "doNotGuessTheSecret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      console.log("chesshkjshk");
      let user = {
        email: profile.emails[0].value,
        name: profile.name.givenName + " " + profile.name.familyName,
        id: profile.id,
        token: accessToken,
      };
      console.log(accessToken);
      console.log(refreshToken);
      User.findOne({ email: user.email }, (err, docs) => {
        if (err) {
          console.log(err);
        } else {
          if (docs) {
            return done(null, user);
          } else {
            return done(null, user);
          }
          console.log("DOCS: ", docs);
        }
      });

      console.log(user);
      // You can perform any necessary actions with your user at this point,
      // e.g. internal verification against a users table,
      // creating new user entries, etc.
      console.log("wtf is happening");

      // User.findOrCreate(..., function(err, user) {
      //     if (err) { return done(err); }
      //     done(null, user);
      // });
    }
  )
);
// Redirect the user to Google for authentication.  When complete,
// Google will redirect the user back to the application at
//     /auth/google/callback
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] }),
  function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/");
    }

    // req / res held in closure
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.send(user);
    });
  }
); // could have a passport auth second arg {scope: 'email'}

// Google will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get(
  "/auth/google/callback",

  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/home",
    failureRedirect: "/",
  })
);

auth(app);
profile(app);
articles(app);
following(app);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
