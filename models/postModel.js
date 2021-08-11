const mongoose = require("mongoose");
const User = require("./userModel");

const Schema = mongoose.Schema;

const postModel = new Schema({
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
  cathegory: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
    required: true,
  },
  authorName: { type: String, required: true },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    select: false,
  },
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
});

module.exports = Post = mongoose.model("post", postModel);
