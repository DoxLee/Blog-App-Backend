const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.export = Reply = mongoose.model("Reply", ReplySchema);
