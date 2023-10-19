require("dotenv").config();

const profile = require("./profile");
const following = require("./following");
const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const auth = require("./src/auth");
const articles = require("./articles");
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000",
  "Access-Control-Allow-Origin": "*",
  credentials: true,
};

const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9auii05.mongodb.net/lively?retryWrites=true&w=majority`;
// "mongodb+srv://bt22:xQ8BdgzsZt1f1iwc@cluster0.9auii05.mongodb.net/lively?retryWrites=true&w=majority";
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header("Content-Type", "application/json;charset=UTF-8");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

console.log("check");

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "lively",
});

app.use((err, req, res, next) => {
  console.error(err.stack); // Log the stack trace for debugging purposes
  res.status(500).send("Internal Server Error"); // Send an appropriate error response
});

console.log("check 2");
auth(app);
// profile(app);
// articles(app);
// following(app);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
