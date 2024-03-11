const slugify = require("slugify");
const Category = require("../modals/categoryModal");
const { Validator } = require("node-input-validator");

const createcategory = async (req, res) => {
  try {
    const { name } = req.body;
    const generatedSlug = slugify(name);

    const existingCategory = await Category.findOne({ name: name });
    if (existingCategory)
      return res.status(409).json({ message: "Category already exists" });

    const v = new Validator(req.body, {
      name: "required",
    });
    const isChecked = v.check();
    if (!isChecked) {
      return res.status(422).json({ errors: v.errors() });
    }

    const category = await Category.create({
      name,
      slug: generatedSlug,
    });

    return res.status(201).json({ category });
  } catch (error) {
    console.log(error, "error in create category");
    res.status(400).send({
      data: "error in creating  new category",
      error: error,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(
      id,
      {
        $set: {
          name: req.body.name,
          slug: slugify(req.body.name),
        },
      },
      {
        new: true,
      }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "category updated",
      data: category,
    });
  } catch (error) {
    console.log("Error in updating the category : ", error);
    res.status(500).json({
      status: false,
      message: "Error in updating the category",
    });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const allCategories = await Category.find();
    res.status(200).json({
      success: true,
      data: allCategories,
    });
  } catch (error) {
    console.log(error, "errorin getting categories");
    res.status(500).json({
      error: error,
    });
  }
};

const singleCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.find({ _id: id });
    if (!category) throw new Error("No Category Found");
    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.log(error, "error in fetching single category");
    res.status(500).json({
      error: "Error in fetching single category!",
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res
        .status(404)
        .json({ message: "No record of this category was found." });
    }
    res.status(200).json({
      message: "Deletion Successful!",
      data: deletedCategory,
    });
  } catch (error) {
    console.log(error, "error in during deletion");
    return res.status(500).json({
      status: false,
      message: "Server Error! Can't perform Delete Operation.",
    });
  }
};

module.exports = {
  createcategory,
  updateCategory,
  getAllCategory,
  deleteCategory,
  singleCategory,
};
