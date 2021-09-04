const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    const accesToken = req.header("access-token");
    if (accesToken === null || accesToken === undefined)
      return res
        .status(401)
        .json({ msg: "No access token, authorization denied." });

    jwt.verify(
      accesToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, user) => {
        if (err) return res.sendStatus(401);

        await User.findById(user.id, (error, user) => {
          if (error) res.send(401);
          req.user = user;
        });
        next();
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = auth;
