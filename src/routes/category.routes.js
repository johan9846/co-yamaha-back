const express = require("express");
const {
  getCategoryProducts,
  getCategories,
  createCategory,
  updateCategory

} = require("../controllers/category.controller");

const router = express.Router();

router.get("/:id/products", getCategoryProducts);
router.get("/allCategories", getCategories); // Corrección: Llamar al controlador directamente
router.post("/addCategory", createCategory); // Corrección: Llamar al controlador directamente
router.put("/updateCategory/:id", updateCategory); 

module.exports = router;
