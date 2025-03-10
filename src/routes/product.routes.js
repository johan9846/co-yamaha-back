const express = require("express");
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const router = express.Router();

router.get("/allProducts", getProducts);
router.post("/addProduct", createProduct);
router.put("/updateProduct/:id", updateProduct); 
router.delete("/deleteProduct/:id", deleteProduct); 

module.exports = router;
