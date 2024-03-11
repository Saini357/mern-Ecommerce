const express = require("express");
const router = express.Router();
const Category = require("../controllers/categoryController");
const middleware = require("../middleware/userMiddleware");

// Category Routes
router.post(
  "/add",
  middleware.authMiddleware,
  middleware.adminAuthMiddleWare,
  Category.createcategory
);
router.get("/all", Category.getAllCategory);
router.get("/single/category/:id", Category.singleCategory);
router.delete(
  "/delete/:id",
  middleware.authMiddleware,
  middleware.adminAuthMiddleWare,
  Category.deleteCategory
);
router.put(
  "/update/:id",
  middleware.authMiddleware,
  middleware.adminAuthMiddleWare,
  Category.updateCategory
);

module.exports = router;
