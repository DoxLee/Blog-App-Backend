const router = require("express").Router();

const auth = require("../middleware/auth");

const authController = require("../controllers/authController");

const Routes = {
  register: "/register",
  login: "/login",
  logout: "/logout",
  getAccessToken: "/get-access-token",
  isLoggedIn: "/is-logged-in",
  changePassword: "/change-password",
};

router.post(Routes.register, authController.register);

router.post(Routes.login, authController.login);

router.post(Routes.logout, auth, authController.logout);

router.post(Routes.getAccessToken, authController.getAccessToken);

router.post(Routes.isLoggedIn, authController.isLoggedIn);

router.post(Routes.changePassword, authController.changePassword);

router.post("/auth-test", auth, (req, res) => {
  console.log(req.user);
  res.json({ asd: "asdasd" });
});

module.exports = router;
