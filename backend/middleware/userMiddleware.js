const jwt = require("jsonwebtoken");
const User = require("../modals/userModal");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer ")) {
      throw new Error("No Token Provided!");
    }

    const splitToken = token.split(" ")[1];
    if (!splitToken) throw new Error("Invalid Token Format!");

    const decoded = jwt.verify(splitToken, process.env.KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error, "error in authenticate middleware");
    return res.status(401).json({ error: "Authentication failed" });
  }
};

const adminAuthMiddleWare = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== "admin") {
      return res
        .status(403)
        .send({ error: "You are not authorized to perform this action" });
    }
    next();
  } catch (error) {
    console.log(error, "error in admin middlware");
  }
};

module.exports = { authMiddleware, adminAuthMiddleWare };
