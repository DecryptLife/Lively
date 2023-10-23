const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const auth = require("./routes/auth");
const profile = require("./routes/profile");
// const articles = require("./routes/articles");
// const following = require("./routes/following");
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000",
  "Access-Control-Allow-Origin": "*",
  credentials: true,
};

const connectionString = `mongodb+srv://benson24:MuNHEjbIslhVW3qv@cluster0.9auii05.mongodb.net/lively?retryWrites=true&w=majority`;
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions));

console.log("check");

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "lively",
});

app.use((req, res, next) => {
  res.header("Content-Type", "application/json;charset=UTF-8");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

auth(app);

profile(app);
// articles(app);
// following(app);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
