const mongoose = require("mongoose");
const categorySchema = mongoose.Schema(
  {
    name: { type: String, unique: true },
   
    slug: {
      type: String,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
