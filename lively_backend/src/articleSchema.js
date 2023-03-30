const mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");

var connection = mongoose.createConnection(
  "mongodb+srv://bt22:xQ8BdgzsZt1f1iwc@cluster0.9auii05.mongodb.net/lively?retryWrites=true&w=majority"
);

autoIncrement.initialize(connection);

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

articleSchema.plugin(autoIncrement.plugin, {
  model: "articles",
  field: "pid",
  startAt: 1,
});

module.exports = articleSchema;
