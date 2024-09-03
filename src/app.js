require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const sequelize = require("./config/database");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");
const productRoutes = require("./routes/product");


const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
// Routes
app.use("/products", productRoutes);
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
