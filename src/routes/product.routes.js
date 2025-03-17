const express = require("express");
const {
  getBrands, getModelsByBrand, getCategoriesByBrandAndModel,
  getProductsId,
  filterProducts,
  searchProducts,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const router = express.Router();

router.get("/brands", getBrands); // Obtener todas las brands (sigue siendo GET)
router.post("/models", getModelsByBrand); // Ahora usa POST y body
router.post("/categories", getCategoriesByBrandAndModel); // Ahora usa POST y body

router.get("/product/:id", getProductsId); // Ruta para buscar productos
router.get("/filter", filterProducts);
router.get("/search", searchProducts); // Ruta para buscar productos
router.get("/allProducts", getProducts);
router.post("/addProduct", createProduct);
router.put("/updateProduct/:id", updateProduct); 
router.delete("/deleteProduct", deleteProduct); 

module.exports = router;
