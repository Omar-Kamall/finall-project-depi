const express = require("express");
const {
  getAllProducts,
  getProduct,
  getCategory,
  getCategories,
  postProduct,
  editProduct,
  deleteProduct,
} = require("../controller/product.controller");
const authentication = require("../middleware/auth.middleware");
const uploadImage = require("../middleware/cloudinaryUpload.middleware");
const router = express.Router();

router.get("/products" , authentication , getAllProducts);
router.get("/product/:id", getProduct);
router.get("/products/category/:category", authentication , getCategory);
router.get("/products/categories" , getCategories);
router.post("/product", authentication, uploadImage.single("image"), postProduct);
router.put("/product/:id", authentication, uploadImage.single("image") , editProduct);
router.delete("/product/:id", authentication, deleteProduct);

module.exports = router;
