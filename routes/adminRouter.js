const router = require("express").Router();
const User = require("../models/userModel");
const adminAuth = require("../middleware/adminAuth");

router.post("/users", async (req, res) => {
  let { limit = 12 } = req.body;
  const users = await User.find({}).sort({ _id: -1 }).limit(limit);
  res.send(users);
});

router.post("/change-role", adminAuth, async (req, res) => {
  let { userId, role } = req.body;
  const user = await User.findByIdAndUpdate(
    { _id: userId },
    { role },
    { useFindAndModify: true },
    (err, user) => {
      if (err) return send.sendStatus(401);
      console.log(user);
    }
  );
  res
    .sendStatus(200)
    .json({ succes: true, message: "You succesfully change the role!" });
});

module.exports = router;
