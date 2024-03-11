const User = require("../modals/userModal");
const { Validator } = require("node-input-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Upload = require("../helpers/image_upload");
const deleteImage = require("../helpers/image_delete");

const createUser = async (req, res) => {
  try {
    // Extract user data from request body
    const userData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      number: req.body.number,
    };

    // Hash the password
    const genSalt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(userData.password, genSalt);

    // Validate user data
    const v = new Validator(req.body, {
      name: "required",
      email: "required|email",
      password: "required|minLength:7",
      number: "required|numeric",
    });

    const isCheck = await v.check();
    if (!isCheck) {
      return res.status(406).json({ errorMessage: v.errors });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: userData.email }, { number: userData.number }],
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ errorMessage: "User is already registered" });
    }

    // Upload photo if it exists
    let photoPath = "";
    let photo = req.files && req.files.photo;
    if (photo) {
      photoPath = await Upload.SinglefileUpload(photo, "images");
    }

    // Create user object
    const userPass = {
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
      number: req.body.number,
      role: req.body.role,
      photo: photoPath,
    };

    // Save user to database
    let user = await User.create(userPass);
    console.log(user);
    return res.status(201).json({ success: true, data: user });
  } catch (error) {
    console.log(`Error in creating new user : ${error}`);
    return res.status(500).json({ success: false, error: error });
  }
};

const LoginUser = async (req, res) => {
  try {
    const { email, password, number } = req.body;

    const user = await User.findOne({
      $or: [{ email: email }, { number: number }],
    });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.KEY, {
      expiresIn: "1d",
    });
    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          photo: user.photo,
          number: user.number,
        },
        token: token,
      },
    });
  } catch (error) {
    console.log("Login Error : ", error);
    return res.status(500).json({ message: "Authentication failed" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Upload photo if it exists
    let photoPath = "";
    let photo = req.files && req.files.photo;
    if (photo) {
      photoPath = await Upload.SinglefileUpload(photo, "images");
    }

    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          role: req.body.role,
          number: req.body.number,
          photo: photoPath,
        },
      },
      {
        new: true,
      }
    );
    if (!updateUser) {
      return res
        .status(404)
        .json({ message: "No user found with the given ID." });
    }
    res.status(200).json({
      success: true,
      data: updateUser,
    });
  } catch (error) {
    console.log("Update User Error : ", error);
    res.status(400).send("Error updating user", error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteImage.DeleteUserImage(id);
    const deleteduser = await User.findByIdAndDelete(id);
    if (!deleteduser) {
      return res
        .status(404)
        .json({ message: "No user found with the given ID." });
    }
    res.status(200).json({
      success: true,
      data: deleteduser,
    });
  } catch (error) {
    console.log("Delete User Error : ", error);
    res.status(500).send("Server Error during the deletion process", error);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    // Sending back a response
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.log(error, "error in fetching users");

    res.status(404).json({
      success: false,
      error: error,
    });
  }
};
module.exports = {
  createUser,
  LoginUser,
  deleteUser,
  updateUser,
  getAllUsers,
};
