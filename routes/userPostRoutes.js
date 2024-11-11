const router = require("express").Router();
const {
  getAllUserPosts,
  createPost,
  getePostbyId,
  deletePost,
  updatePost,
} = require("../controllers/userPostController");


//user post routes
router.get("/get-all-user-posts/:userId", getAllUserPosts);
router.post("/create-post", createPost);
router.get("/get-post/:postId", getePostbyId);
router.delete("/delete-post/:postId", deletePost);
router.put("/update-post/:postId", updatePost);

module.exports = router;
