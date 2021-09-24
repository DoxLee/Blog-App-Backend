const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Refreshtoken = require("../models/refreshTokenModel");

/** @type {import("express").RequestHandler} */

const auth = async (req, res, next) => {
  try {
    // Get cookies
    const { cookies } = req;
    // Get access token and verify
    let decodedToken;
    let accessToken = cookies["access-token"];

    if (accessToken === null || accessToken === undefined)
      return res
        .status(401)
        .json({ msg: "No access token, authorization denied." });

    // Verify access token if token expired, use refresh token and get brand new access token.
    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, user) => {
        if (err.name === "TokenExpiredError") {
          //Check the error if error is the token expired error use refresh token to get new access token.
          // Getting refresh token
          let refreshToken = cookies["refresh-token"];
          try {
            // Check if the refresh token exists in the database
            const validate = await RefreshToken.findOne({ refreshToken });

            // If refresh token is not exist in the database just clear cookies and return 401 Not Authenticated!
            if (validate === null) {
              res.json({ msg: "Refresh token is not valid!" });
            }

            // Verify refresh token
            jwt.verify(
              refreshToken,
              process.env.REFRESH_TOKEN_SECRET,
              async (err, user) => {
                if (err) {
                  res.json({ msg: "Refresh token is not right!" });
                }
                // Generate brand new access token

                console.log(accessToken);

                accessToken = await jwt.sign(
                  user,
                  process.env.ACCESS_TOKEN_SECRET,
                  {
                    expiresIn: "10s",
                  }
                );
                //Decode token
                decodedToken = jwt.decode(accessToken);

                // Change the access token
                res.cookie("access-token", accessToken, { httpOnly: true });
              }
            );
          } catch (error) {
            return res.json({ error });
          }
        } else if (err) {
          return res.status(401);
        } else {
          decodedToken = { id: user.id };
        }

        await User.findById(decodedToken.id, (error, user) => {
          if (error) {
            res.status(401);
          }
          req.user = user;
          next();
        });
      }
    );
  } catch (err) {
    res.json({ error: err.message });
  }
};

module.exports = auth;
