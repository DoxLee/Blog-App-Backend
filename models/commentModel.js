const mongoose = require("mongoose");
const User = require("./userModel");
const Post = require("./postModel");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// CommentSchema.pre("save", async function (next) {
//   try {
//     await Post.find({ _id: doc.article }).populate({
//       path: "comments",
//       author: this.author,
//     });
//   } catch (error) {
//     res.json(error);
//   }
// });

CommentSchema.pre("remove", async function (next) {
  var comment = this;
  let post = await Post.findById(comment.post).select("comments");
  post.comments = post.comments.filter(
    (item) => String(item) !== String(comment._id)
  );
  await post.save();
  next();
});

module.exports = Comment = mongoose.model("comment", CommentSchema);
