const express = require("express");
const upload = require("../config/multer");
const router = express.Router();

const {
  filterProducts,
  searchProducts,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");


router.get("/filter", filterProducts);
router.get("/search", searchProducts); // Ruta para buscar productos
router.get("/allProducts", getProducts);
router.post("/addProduct", upload.single("image"), createProduct);
router.put("/updateProduct/:id", updateProduct); 
router.delete("/deleteProduct", deleteProduct); 

module.exports = router;
