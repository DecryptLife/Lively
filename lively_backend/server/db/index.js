const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
  text: {
    type: String,
    required: [true, "Post body can't be empty"],
  },
  author: {
    type: String,
  },
  author_image: {
    type: String,
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

const commentsSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Comment field must not be empty"],
  },
  author: {
    type: String,
    required: [true, "Comment must have an author"],
  },
  author_image: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);
const Profile = mongoose.model("Profile", profileSchema);
const Article = mongoose.model("Article", articleSchema);
const Comments = mongoose.model("Comments", commentsSchema);

module.exports = {
  User,
  Profile,
  Article,
  Comments,
};
