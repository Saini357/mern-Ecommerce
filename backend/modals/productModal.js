const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  slug: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  shipping: {
    type: Boolean,
    default: false,
  },
  image: {
    type: [String],
    default: "",
  },

  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      content: {
        type: String,
      },
      rating: {
        type: Number,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
