const router = require("express").Router();
const {
  getAllUserItem,
  createItem,
  getItembyId,
  deleteItem,
  updateItem,
} = require("../controllers/userItemsController");


//user post routes
router.get("/get-all-user-items/:userId", getAllUserItem);
router.post("/create-item", createItem);
router.get("/get-item/:itemId", getItembyId);
router.delete("/delete-item/:itemId", deleteItem);
router.put("/update-item/:itemId", updateItem);

module.exports = router;
