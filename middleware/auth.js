const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

/** @type {import("express").RequestHandler} */

const auth = async (req, res, next) => {
  try {
    const { cookies } = req;
    const accessToken = cookies["access-token"];

    if (accessToken === null || accessToken === undefined)
      return res
        .status(401)
        .json({ msg: "No access token, authorization denied." });

    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, user) => {
        if (err) {
          console.log("error");
          return res.sendStatus(401);
        }

        await User.findById(user.id, (error, user) => {
          if (error) return res.status(401);
          console.log(user);
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
