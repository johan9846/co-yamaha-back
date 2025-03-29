const express = require("express");
const cors = require("cors");

const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();

app.use(express.json());
app.use(cors());

// Registrar rutas
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/order", orderRoutes);

module.exports = app;
