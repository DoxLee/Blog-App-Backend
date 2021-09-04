const router = require("express").Router();

const authController = require("../controllers/authController");

const auth = require("../middleware/auth");

const Routes = {
  register: "/register",
  login: "/login",
  logout: "/logout",
  getAccessToken: "/get-access-token",
  isLoggedIn: "/is-logged-in",
  changePassword: "/change-password",
};

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

    const newUser = new User({
      email: email,
      userName: userName,
      password: hashedPassword,
    });
    const user = await newUser.save();

    const accesToken = generateAccessToken({
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

router.post(Routes.login, authController.login);

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
    const token = req.header("access-token");

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
