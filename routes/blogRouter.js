const router = require("express").Router();
const Post = require("../models/postModel");
const auth = require("../middleware/auth");
const User = require("../models/userModel");

const routes = {
  getPosts: "/get-posts",
  createBlogPost: "/create-blog-post",
  getPost: "/get-post",
  updatePost: "/update-blog-post",
  userPosts: "/get-user-posts",
};

router.post(routes.userPosts, auth, async (req, res) => {
  try {
    const userPosts = await Post.find({ author: req.user._id });
    res.json(userPosts);
  } catch (err) {
    return res.json(err);
  }
});

router.post(routes.getPosts, async (req, res) => {
  try {
    let { limit = 6, filter = {} } = req.body;

    const posts = await Post.find(filter).sort({ _id: -1 }).limit(limit);
    res.json(posts);
  } catch (error) {
    res.json({ err: error });
  }
});

router.post(routes.updatePost, auth, async (req, res) => {
  let { id, title, description, content } = req.body;
  try {
    let post = await Post.findById(id).select("+author");
    post.title = title;
    post.description = description;
    post.content = content;

    if (post.author + "" !== req.user._id + "") return res.sendStatus(401);
    const updatedPost = await post.save();
    res.json({ succes: true });
  } catch (err) {
    res.json(err);
  }
});

router.post(routes.getPost, async (req, res) => {
  let { id } = req.body;

  if (!id) {
    res.json({ err: "You should enter the id!" });
  }
  try {
    const post = await Post.findById(id);
    res.json(post);
  } catch (error) {
    res.json({ err: error });
  }
});

router.post(routes.createBlogPost, auth, async (req, res) => {
  try {
    let { title, content, description } = req.body;

    if (!title || !content || !description)
      return res.json({ err: "You should fill the text area or title! " });

    const post = new Post({
      title,
      description,
      content,
      authorName: req.user.userName,
      author: req.user._id,
    });

    const postRes = await post.save();
    res.json(true);
  } catch (error) {
    res.json({ err: error });
  }
});

module.exports = router;
