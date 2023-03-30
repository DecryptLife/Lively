const mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");

var connection = mongoose.createConnection(
  "mongodb+srv://bt22:xQ8BdgzsZt1f1iwc@cluster0.9auii05.mongodb.net/lively?retryWrites=true&w=majority"
);

autoIncrement.initialize(connection);

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

profileSchema.plugin(autoIncrement.plugin, {
  model: "profile",
  field: "u_id",
  startAt: 1,
});

module.exports = profileSchema;
