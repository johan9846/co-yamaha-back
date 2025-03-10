const express = require("express");
const {
  getCategoryProducts,
  getCategories,
  createCategory,
} = require("../controllers/category.controller");

const router = express.Router();

router.get("/:id/products", getCategoryProducts);
router.get("/allCategories", getCategories); // Corrección: Llamar al controlador directamente
router.post("/addCategory", createCategory); // Corrección: Llamar al controlador directamente

module.exports = router;
