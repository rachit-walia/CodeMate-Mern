const Post = require("../models/postModel");

// Fetch all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "firstname lastname email")
      .populate("comments.user", "firstname lastname email")
      .sort({ createdAt: -1 });

    console.log("✅ All posts fetched"); // debug log
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    console.error("❌ Error in getAllPosts:", err);
    res.status(500).json({ message: "Unable to fetch posts", success: false });
  }
};

// Fetch posts with filters (search / author)
const getPosts = async (req, res) => {
  try {
    const { search, author } = req.query;
    let posts;

    if (search) {
      posts = await Post.find({ body: new RegExp(search, "i") })
        .populate("author", "firstname lastname email")
        .populate("comments.user", "firstname lastname email")
        .sort({ createdAt: -1 });
    } else if (author) {
      posts = await Post.find({ author })
        .populate("author", "firstname lastname email")
        .populate("comments.user", "firstname lastname email")
        .sort({ createdAt: -1 });
    } else {
      posts = await Post.find()
        .populate("author", "firstname lastname email")
        .populate("comments.user", "firstname lastname email")
        .sort({ createdAt: -1 });
    }

    console.log("✅ Filtered posts fetched"); // debug log
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    console.error("❌ Error in getPosts:", err);
    res.status(500).json({ success: false, message: "Cannot fetch posts" });
  }
};

// Create a new post
const createPost = async (req, res) => {
  try {
    const { body } = req.body;
    if (!body) {
      return res
        .status(400)
        .json({ message: "Post body is required", success: false });
    }

    const post = new Post({ author: req.user._id, body });
    await post.save();

    console.log("✅ Post created:", post._id); // debug log
    res.status(201).json({ message: "Post created successfully", success: true, data: post });
  } catch (err) {
    console.error("❌ Error in createPost:", err);
    res.status(500).json({ message: "Unable to create post", success: false });
  }
};

// Update an existing post
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req.body;

    const post = await Post.findOne({ _id: id, author: req.user._id });
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    if (body) post.body = body;
    await post.save();

    console.log("✅ Post updated:", id); // debug log
    res.status(200).json({ message: "Post updated successfully", success: true, data: post });
  } catch (err) {
    console.error("❌ Error in updatePost:", err);
    res.status(500).json({ message: "Unable to update post", success: false });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findOneAndDelete({ _id: id, author: req.user._id });
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized", success: false });

    console.log("✅ Post deleted:", id); // debug log
    res.status(200).json({ message: "Post deleted successfully", success: true });
  } catch (err) {
    console.error("❌ Error in deletePost:", err);
    res.status(500).json({ message: "Unable to delete post", success: false });
  }
};

// Add comment to a post
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text)
      return res
        .status(400)
        .json({ message: "Comment cannot be empty", success: false });

    const post = await Post.findById(id);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    post.comments.push({ user: req.user._id, text });
    await post.save();

    console.log("✅ Comment added to post:", id); // debug log
    res.status(200).json({ message: "Comment added successfully", success: true, data: post });
  } catch (err) {
    console.error("❌ Error in addComment:", err);
    res.status(500).json({ message: "Unable to add comment", success: false });
  }
};

module.exports = {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  addComment,
  getPosts,
};
