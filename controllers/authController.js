const User = require("../models/userModel");
const RefreshToken = require("../models/refreshTokenModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateAccessToken = (user) =>
  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });

const generateRefreshToken = (user) =>
  jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

/** @type {import("express").RequestHandler} */
exports.register = async (req, res) => {
  try {
    let { email, userName, password, passwordCheck } = req.body;

    if (!email || !userName || !password || !passwordCheck) {
      return res.status(400).json({ err: "You should enter the all fields" });
    }
    if (password.length < 5)
      return res
        .status(400)
        .json({ err: "The password needs to be at least 5 characters long." });

    if (password !== passwordCheck)
      return res
        .status(400)
        .json({ err: "Enter the same password twice for verification." });

    const newUser = new User({
      email: email,
      userName: userName,
      password: password,
    });
    const user = await newUser.save();

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

    res.cookie("access-token", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.cookie("refresh-token", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.json({
      id: user._id,
      userName: user.userName,
    });
  } catch (err) {
    res.status(500).json({ err: `Database Problem \n${err.message}` });
  }
};

/** @type {import("express").RequestHandler} */
exports.login = async (req, res) => {
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

    // Create Cookies for connection stay alive
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

/** @type {import("express").RequestHandler} */
exports.logout = async (req, res) => {
  try {
    await RefreshToken.deleteOne({
      userId: req.userId || null,
    });

    res.clearCookie("refresh-token");
    res.clearCookie("access-token");
    res.status(200);
  } catch (err) {
    res.json({ err: `Database Problem \n${err.message}` });
  }
};

/** @type {import("express").RequestHandler} */
exports.getAccessToken = async (req, res) => {
  try {
    const refreshToken = req.header("refresh-token");

    const validate = await RefreshToken.findOne({ refreshToken });

    if (validate === null) return res.status(401);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.json({ success: false, err });
      const accessToken = generateAccessToken({ id: user.id });
      res.json({ accessToken });
    });
  } catch (error) {
    res.json({ err: `Not Authorized` });
  }
};
/** @type {import("express").RequestHandler} */
exports.isLoggedIn = async (req, res) => {
  try {
    const token = req.header("access-token");

    if (!token) return res.json(false);

    const verified = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, payload) => {
        if (err) return res.status(401);

        const user = await User.findById(payload.id);
        if (!user) return res.json(false);
        return res.json({
          user: {
            id: user._id,
            userName: user.userName,
          },
        });
      }
    );
  } catch (err) {
    res.json({ err: `Database Problem \n${err.message}` });
  }
};
/** @type {import("express").RequestHandler} */
exports.changePassword = async (req, res) => {
  try {
    res.send(200);
  } catch (error) {
    res.json(error);
  }
};
