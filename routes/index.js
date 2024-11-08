const router = require("express").Router();
const {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} = require("../controllers/index");

router.get("/", getUsers);
router.post("/", createUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);

module.exports = router;
