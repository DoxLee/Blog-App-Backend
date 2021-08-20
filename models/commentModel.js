const mongoose = require("mongoose");
const User = require("./userModel");
const Post = require("./postModel");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Comment = mongoose.model("comment", CommentSchema);
