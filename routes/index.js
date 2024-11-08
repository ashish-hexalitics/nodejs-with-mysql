const router = require("express").Router();
const {
  getUsers,
  createUser,
  getUserById,
  deleteUser,
  updateUser,
} = require("../controllers/index");

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);

module.exports = router;
