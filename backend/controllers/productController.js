const Product = require("../modals/productModal");
const { Validator } = require("node-input-validator");
const { MultiplefileUpload } = require("../helpers/image_upload");
const image = require("../helpers/image_delete");

const createProduct = async (req, res) => {
  try {
    const { title, quantity, description, price, category } = req.body;
    const existingProduct = await Product.findOne({ title: title });

    if (existingProduct) {
      return res.status(409).json({ message: "Product already exists" });
    }

    const v = new Validator(req.body, {
      title: "required",
      quantity: "required",
      description: "required",
      price: "required",
      category: "required",
    });

    const isChecked = await v.check();
    if (!isChecked) {
      return res.status(422).json(v.errors);
    }

    // Handle image
    let imagePaths = [];
    let pics = req.files && req.files.image;
    if (pics) {
      imagePaths = await MultiplefileUpload(pics, "images");
    }

    const product = await Product.create({
      title,
      quantity,
      description,
      price,
      category,

      image: imagePaths,
    });
    res.status(201).json(product);
  } catch (error) {
    console.log(error, "error in creating products");
    res.status(400).json({
      data: "error in creating product",
      error: error,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, quantity, description, price, category, rating } = req.body;

    const v = new Validator(req.body, {
      title: "required",
      quantity: "required",
      description: "required",
      price: "required",
      category: "required",
    });
    const isChecked = await v.check();
    if (!isChecked) {
      return res.status(400).send(v.errors);
    }

    let imagePaths = [];
    let pics = req.files && req.files.image;
    if (pics) {
      imagePaths = await MultiplefileUpload(pics, "../public/images");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          quantity,
          description,
          price,
          category,

          image: imagePaths,
        },
      },
      {
        new: true,
      }
    );
    if (!updatedProduct) {
      return next({ status: 404, message: "No product with that ID" });
    }
    res.status(200).json({
      message: "Product updated",
      data: updatedProduct,
    });
  } catch (error) {
    console.log(error, "error in updating products");
    res.status(500).send("Server Error!");
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await image.DeleteProductImage(id);

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(400).json({ message: "No product with this ID!" });
    }

    res.status(200).json({
      message: "succesfuuly deleted",
      data: deletedProduct,
    });
  } catch (error) {
    console.log(error, "Server error during prduct deletion");
    res.status(500).send("Server error during prduct deletion");
  }
};

const getaProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById({ _id: id }).populate("category");

    res.status(200).json({
      count: product.length,
      data: product,
    });
  } catch (error) {
    console.log(error, "error in fetching the products");
    res
      .status(500)
      .json({ message: "error during fetching the products", error: error });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.where("category").equals(
      req.query.category
    );
    res.status(200).json({
      count: allProducts.length,
      data: allProducts,
    });
  } catch (error) {
    console.log(error, "error in fetching the products");
    res
      .status(500)
      .json({ message: "error during fetching the products", error: error });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getaProduct,
};
