const express = require("express");
const {
  getProductsId,
  filterProducts,
  searchProducts,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const router = express.Router();
router.get("/product/:id", getProductsId); // Ruta para buscar productos
router.get("/filter", filterProducts);
router.get("/search", searchProducts); // Ruta para buscar productos
router.get("/allProducts", getProducts);
router.post("/addProduct", createProduct);
router.put("/updateProduct/:id", updateProduct); 
router.delete("/deleteProduct", deleteProduct); 

module.exports = router;
