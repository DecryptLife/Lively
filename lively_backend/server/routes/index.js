const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const auth = require("../routes/auth");
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000",
  "Access-Control-Allow-Origin": "*",
  credentials: true,
};

const connectionString = `mongodb+srv://benson24:MuNHEjbIslhVW3qv@cluster0.9auii05.mongodb.net/Lively?retryWrites=true&w=majority`;
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions));

console.log("check");

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "Lively",
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

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// app.use((err, req, res, next) => {
//   console.error(err.stack); // Log the stack trace for debugging purposes
//   res.status(500).send("Internal Server Error"); // Send an appropriate error response
// });

// console.log("check 2");

// profile(app);
// articles(app);
// following(app);xQ8BdgzsZt1f1iwc
