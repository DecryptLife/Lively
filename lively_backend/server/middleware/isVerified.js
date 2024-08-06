const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

function isVerified(req, res, next) {
  const token = req.cookies && req.cookies.token;

  if (!token) return res.status(401).json({ error: "access denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log(err.message);
      return res.status(401).json({ message: "access denied" });
    }

    req.user = user;
    next();
  });
}

module.exports = isVerified;
