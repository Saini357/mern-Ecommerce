const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const conectDB = require("./connectDB/db");
const Route = require("./routes/userRoutes");
const CategoryRoute = require("./routes/categoryRoutes");
const ProductRoute = require("./routes/productRoutes");
const fileupload = require("express-fileupload");

// Load environment variables
dotenv.config();

// Set up Express app
const app = express();
const PORT = process.env.PORT || 1536;

// Connect to the database
conectDB();

// Middleware for parsing JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileupload());
app.use(cors());

// Routes
app.use("/", Route);
app.use("/category", CategoryRoute);
app.use("/product", ProductRoute);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
