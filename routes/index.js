const router = require("express").Router();
const {
  getUsers,
  createUser,
  getUserById,
  deleteUser,
  updateUser,
  getAllUserPosts,
  createPost,
  getePostbyId,
  deletePost,
  updatePost,
} = require("../controllers/index");

//user routes
router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);

//user post routes
router.get("/posts/:userId", getAllUserPosts);
router.post("/post", createPost);
router.get("/post/:postId", getePostbyId);
router.delete("/post/:postId", deletePost);
router.put("/post/:postId", updatePost);

module.exports = router;
