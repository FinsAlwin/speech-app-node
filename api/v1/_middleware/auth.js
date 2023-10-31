const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.requireSignin = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.SAFE_WORD);
    req.user = user;
  } else {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};
