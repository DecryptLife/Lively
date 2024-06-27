const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const auth = require("./server/routes/auth");
const profile = require("./server/routes/profile");
const articles = require("./server/routes/articles");
const following = require("./server/routes/following");
const { MONGODB_STRING } = require("./config");
const cors = require("cors");

const corsOptions = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
};

const connectionString = `mongodb+srv://benson24:${MONGODB_STRING}@cluster0.9auii05.mongodb.net/lively?retryWrites=true&w=majority`;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

console.log("check");

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "lively",
});

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Origin",
    "https://lively-frontend-5tunqwswe-decryptlife.vercel.app"
  );

  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization,Access-Control-Allow-Credentials"
  );

  console.log(req.method);
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

auth(app);

profile(app);
articles(app);
following(app);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
