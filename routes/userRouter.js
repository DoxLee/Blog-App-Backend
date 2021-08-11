const router = require("express").Router();
const User = require("../models/userModel");
const RefreshToken = require("../models/refreshTokenModel");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Routes = {
  register: "/register",
  login: "/login",
  logout: "/logout",
  getAccesToken: "/get-acces-token",
  isLoggedIn: "/is-logged-in",
  changePassword: "/change-password",
};

const generateAccesToken = (user) =>
  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "2h" });

const generateRefreshToken = (user) =>
  jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

router.post(Routes.register, async (req, res) => {
  try {
    let { email, userName, password, passwordCheck } = req.body;
    // check user already exist or not

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email: email,
      userName: userName,
      password: hashedPassword,
    });
    const user = await newUser.save();

    const accesToken = generateAccesToken({
      id: user._id,
    });

    await RefreshToken.deleteMany({ userId: user._id });

    const refreshToken = generateRefreshToken({ id: user._id });

    const newRefreshToken = new RefreshToken({
      refreshToken,
      userId: user._id,
    });

    const savedRefreshToken = await newRefreshToken.save();

    res.json({
      accesToken,
      refreshToken,
      user: {
        id: user._id,
        userName: user.userName,
      },
    });
  } catch (err) {
    res.status(500).json({ err: `Database Problem \n${err.message}` });
  }
});

router.post(Routes.login, async (req, res) => {
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

    const accesToken = generateAccesToken({
      id: user._id,
    });

    await RefreshToken.deleteMany({ userId: user._id });

    const refreshToken = generateRefreshToken({ id: user._id });

    const newRefreshToken = new RefreshToken({
      refreshToken,
      userId: user._id,
    });

    const savedRefreshToken = await newRefreshToken.save();

    res.json({
      accesToken,
      refreshToken,
      user: {
        id: user._id,
        userName: user.userName,
      },
    });
  } catch (err) {
    res.json({ err: `Database Problem \n${err.message}` });
  }
});

router.delete(Routes.logout, auth, async (req, res) => {
  try {
    const deletedRefreshToken = await RefreshToken.deleteOne({
      userId: req.userId || null,
    });
    res.sendStatus(200);
  } catch (err) {
    res.json({ err: `Database Problem \n${err.message}` });
  }
});

router.post(Routes.getAccesToken, async (req, res) => {
  try {
    const refreshToken = req.header("refresh-token");

    const validate = await RefreshToken.findOne({ refreshToken });

    if (validate === null) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.json({ succes: false, err });
      const accesToken = generateAccesToken({ id: user.id });
      res.json({ accesToken });
    });
  } catch (error) {
    res.json({ err: `Not Authorized` });
  }
});

router.post(Routes.isLoggedIn, async (req, res, next) => {
  try {
    const token = req.header("acces-token");

    if (!token) return res.json(false);

    const verified = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, payload) => {
        if (err) return res.sendStatus(401);

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
});

router.post(Routes.changePassword, auth, async (req, res) => {
  res.send("Change-password");
});

module.exports = router;
