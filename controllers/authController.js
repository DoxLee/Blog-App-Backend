const User = require("../models/userModel");
const RefreshToken = require("../models/refreshTokenModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateAccessToken = (user) =>
  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "2h" });

const generateRefreshToken = (user) =>
  jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

module.exports.login = async (req, res) => {
  try {
    let { userName, password } = req.body;

    if (!userName || !password) {
      res.status(400).json({ err: "Username or password is empty!" });
    }
    let user = await User.findOne({ userName: userName }).select([
      "userName",
      "password",
    ]);

    if (user === null)
      return res.status(400).json({ err: "There is no such user!" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ err: "Invalid password." });

    const accessToken = generateAccessToken({
      id: user._id,
    });

    await RefreshToken.deleteMany({ userId: user._id });

    const refreshToken = generateRefreshToken({ id: user._id });

    const newRefreshToken = new RefreshToken({
      refreshToken,
      userId: user._id,
    });

    await newRefreshToken.save();

    res.cookie("access-token", accessToken, { httpOnly: true });
    res.cookie("refresh-token", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.json({
      id: user._id,
      userName: user.userName,
    });
  } catch (err) {
    res.json({ err: `Database Problem \n${err.message}` });
  }
};
