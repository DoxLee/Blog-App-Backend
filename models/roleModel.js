const User = require("./userModel");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  permissions: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Permission",
    },
  ],
});

module.exports = Role = mongoose.model("role", roleSchema);
