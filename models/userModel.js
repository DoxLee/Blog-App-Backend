const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

// Hash password before save

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = User = mongoose.model("user", userSchema);
