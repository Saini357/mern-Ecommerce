const Category = require("../modals/categoryModal");
const Product = require("../modals/productModal");
const User = require("../modals/userModal");
const fs = require("fs");
const path = require("path");

const DeleteUserImage = async (id) => {
  try {
    const user = await User.findById(id);
    const imagePath = user.photo;

    const filePath = path.join(__dirname, `../public/${imagePath}`);

    fs.unlink(filePath, function (err) {
      if (!err) {
        console.log("File deleted successfully");
      } else {
        console.error(err);
      }
    });
  } catch (error) {
    console.log(error, "error in user image deletion");
  }
};

const DeleteCategoryImage = async (id) => {
  try {
    const category = await Category.findOne({ _id: id });

    if (!category) {
      throw new Error("Category not found");
    }

    const imagePath = category.image;
    const filePath = path.join(__dirname, imagePath);

    fs.unlink(filePath, function (err) {
      if (!err) {
        console.log("File deleted successfully");
      } else {
        console.error(err);
      }
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

const DeleteProductImage = async (id) => {
  try {
    const product = await Product.findOne({ _id: id });
    if (!product) {
      console.log("Product not found");
      return;
    }

    product.image.map(async (image_name) => {
      var imagePath = path.join(__dirname, image_name);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(`Error deleting image ${image_name}:`, err);
        } else {
          console.log(`Deleted image: ${imagePath}`);
        }
      });
    });
  } catch (error) {
    console.error("Error in finding product: ", error);
  }
};

module.exports = { DeleteCategoryImage, DeleteProductImage, DeleteUserImage };
