const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  u_id: {
    type: Number,
  },

  username: {
    type: String,
    required: [true, "Username is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },

  password: {
    type: String,
    required: [true, "Password is required"],
  },
  created: {
    type: Date,
    required: [true, "Created date is required"],
  },
});

const profileSchema = new mongoose.Schema({
  u_id: {
    type: Number,
  },
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  headline: {
    type: String,
    required: [true, "Headline is required"],
  },
  dob: {
    type: String,
    required: [true, "Date of Birth is required"],
  },
  mobile: {
    type: String,
    required: [true, "Mobile no is required"],
  },
  zipcode: {
    type: String,
    required: [true, "Zipcode is required"],
  },
  avatar: {
    type: Object,
  },
  following: [],
});

const articleSchema = new mongoose.Schema({
  pid: {
    type: Number,
  },
  author: {
    type: String,
  },
  text: {
    type: String,
    required: [true, "Post body can't be empty"],
  },
  image: {
    type: Object,
  },
  date: {
    type: Date,
    required: [true, "Posted date is required"],
  },
  comments: [],
});

const User = mongoose.model("User", userSchema);
const Profile = mongoose.model("Profile", userSchema);
const Article = mongoose.model("Article", userSchema);

module.exports = {
  User,
  Profile,
  Article,
};
