const express = require("express");
const cors = require("cors");

const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");

const app = express();

app.use(express.json());
app.use(cors());

// Registrar rutas de tablas
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);

module.exports = app;
