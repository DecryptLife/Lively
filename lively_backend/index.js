const express = require("express");
const PORT = process.env.PORT || 8000;
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRoutes = require("./server/routes/auth");
const profile = require("./server/routes/profile");
const articles = require("./server/routes/articles");
const following = require("./server/routes/following");
const { MONGODB_STRING } = require("./config");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config();

const allowedOrigins = ["http://localhost:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    // Check if origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE,PATCH",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.json());
app.use(cookieParser()); // Set the limit to 50mb (adjust as needed)

const connectionString = `mongodb+srv://benson24:${MONGODB_STRING}@cluster0.9auii05.mongodb.net/lively?retryWrites=true&w=majority`;

try {
  console.log("connecting to mongodb");
  mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "lively",
  });
} catch (err) {
  console.log("Error: " + err);
}

mongoose.connection.on("connected", () => console.log("connected"));

app.get("/check", (req, res) => {
  console.log("In ");
  res.json({ message: "Test" });
});

// app.use("/auth", authRoutes);
// app.use("/profile", profileRoutes);
// app.use("/article", articleRoutes);
// app.use("/following", followingRoutes);
authRoutes(app);
//
profile(app);
articles(app);
following(app);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
