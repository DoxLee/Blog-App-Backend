const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  profilePhoto: {
    type: Object,
  },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5, select: false },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    required: true,
    enum: ["superAdmin", "admin", "user"],
    default: "user",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = User = mongoose.model("user", userSchema);
