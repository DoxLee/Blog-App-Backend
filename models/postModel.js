const mongoose = require("mongoose");
const User = require("./userModel");
const Comment = require("./commentModel");

const Schema = mongoose.Schema;

const postModel = new Schema({
  image: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  cathegory: [
    {
      type: String,
      required: true,
    },
  ],
  tag: [
    {
      type: String,
    },
  ],
  publishAt: {
    type: Date,
    default: Date.now(),
  },
  authorName: { type: String, required: true },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now(), select: false },
  // Store Likes with user ref
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment", select: false }],
});

module.exports = Post = mongoose.model("post", postModel);
