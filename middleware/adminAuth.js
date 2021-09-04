const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = (req, res, next) => {
  try {
    const accesToken = req.header("access-token");
    if (!accesToken)
      return res
        .status(401)
        .json({ msg: "No access token, authorization denied." });

    jwt.verify(accesToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(401);
      if (user.role === "admin") {
        if (err) return res.sendStatus(401);
        User.findById(user.id, (err, user) => {
          if (err) return res.sendStatus(401);
          if (user.role !== "admin") res.sendStatus(401);
        });
      }
    });
    next();
  } catch (err) {
    res.sendStatus(500).json({ error: err.message });
  }
};

module.exports = auth;
