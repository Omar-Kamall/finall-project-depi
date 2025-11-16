const express = require("express");
const {
  getAllProducts,
  getProduct,
  postProduct,
  editProduct,
  deleteProduct,
} = require("../controller/product.controller");
const authentication = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/products", getAllProducts);
router.get("/product/:id", getProduct);
router.post("/product", authentication, postProduct);
router.put("/product/:id", authentication, editProduct);
router.delete("/product/:id", authentication, deleteProduct);

module.exports = router;
