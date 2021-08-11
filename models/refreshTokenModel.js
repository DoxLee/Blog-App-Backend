const User = require("./userModel");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema({
  refreshToken: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = RefreshToken = mongoose.model(
  "refreshToken",
  refreshTokenSchema
);
