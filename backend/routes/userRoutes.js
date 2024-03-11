const express = require("express");
const router = express.Router();
const User = require("../controllers/userController");
const middleware = require("../middleware/userMiddleware");

router.post("/create", User.createUser);
router.post("/login", User.LoginUser);
router.put(
  "/update/:id",
  middleware.authMiddleware,
  middleware.adminAuthMiddleWare,
  User.updateUser
);
router.delete(
  "/delete/:id",
  middleware.authMiddleware,
  middleware.adminAuthMiddleWare,
  User.deleteUser
);
router.get(
  "/all-users",
  middleware.authMiddleware,
  middleware.adminAuthMiddleWare,
  User.getAllUsers
);

//protected route path for users
router.get("/user-auth", middleware.authMiddleware, (req, res) => {
  res.status(200).json({
    ok: true,
  });
});
router.get(
  "/admin-auth",
  middleware.authMiddleware,
  middleware.adminAuthMiddleWare,
  (req, res) => {
    res.status(200).json({
      ok: true,
    });
  }
);

module.exports = router;
