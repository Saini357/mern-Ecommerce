const express = require("express");
const router = express.Router();
const middleware = require("../middleware/userMiddleware");
const Product = require("../controllers/productController");

router.post(
  "/create",
  middleware.authMiddleware,
  middleware.adminAuthMiddleWare,
  Product.createProduct
);
router.put(
  "/update/:id",
  middleware.authMiddleware,
  middleware.adminAuthMiddleWare,
  Product.updateProduct
);
router.get(
  "/all/products",
  middleware.authMiddleware,
  middleware.adminAuthMiddleWare,
  Product.getAllProducts
);
router.get(
  "/single/:slug",
  middleware.authMiddleware,
  middleware.adminAuthMiddleWare,
  Product.getaProduct
);
router.delete(
  "/delete/:id",
  middleware.authMiddleware,
  middleware.adminAuthMiddleWare,
  Product.deleteProduct
);

module.exports = router;
