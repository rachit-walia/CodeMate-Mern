const express = require("express");
const passport = require("passport");
const {
  getPosts,        // handles search/author filters OR returns all
  createPost,
  updatePost,
  deletePost,
  addComment,
} = require("../controllers/postControllers");

const router = express.Router();

// Public routes
router.get("/", getPosts);  // GET http://localhost:4500/api/posts?search=xyz&author=123

// Protected routes
router.post("/", passport.authenticate("jwt", { session: false }), createPost);
router.put("/:id", passport.authenticate("jwt", { session: false }), updatePost);
router.delete("/:id", passport.authenticate("jwt", { session: false }), deletePost);
router.post("/:id/comment", passport.authenticate("jwt", { session: false }), addComment);

module.exports = router;
















// const express = require("express");
// const passport = require("passport");
// const {
//   getAllPosts,
//   createPost,
//   updatePost,
//   deletePost,
//   addComment,
//   getPosts,
// } = require("../controllers/postControllers");

// const router = express.Router();


// router.get("/all", getAllPosts);   
// // GET http://localhost:4500/api/getAllPosts/all
// router.get("/", getPosts);         
// // GET http://localhost:4500/api/getAllPosts 


// router.post("/", passport.authenticate("jwt", { session: false }), createPost);
// router.put("/:id", passport.authenticate("jwt", { session: false }), updatePost);
// router.delete("/:id", passport.authenticate("jwt", { session: false }), deletePost);
// router.post("/:id/comment", passport.authenticate("jwt", { session: false }), addComment);

// module.exports = router;
