require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const sequelize = require("./config/database");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");
const productRoutes = require("./routes/product");
const addressRoutes = require("./routes/address");
const User = require('./models/user');
const Product = require('./models/product');
const ProductImage = require('./models/productImage');
const ProductVariation = require('./models/productvariation');
const ProductVariationOption = require('./models/productvariationoption');
const Address = require('./models/useraddress');
const Stock = require('./models/stock');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
// Routes
app.use("/products", productRoutes);
app.use("/user", routes);
app.use("/addresses", addressRoutes);
app.use("/", routes);

(async () => {
  try {
    await sequelize.sync(); // Sync all models at once
    console.log("Database & tables created!");
  } catch (err) {
    console.error("Error creating tables:", err);
  }
})();

app.use(errorHandler);

module.exports = app;
