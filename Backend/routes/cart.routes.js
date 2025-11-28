const express = require("express");
const { getCartItems, addProductToCart, updateProductQuantity, removeProductFromCart , clearProductsFromCart } = require("../controller/cart.controller");
const authentication = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/getCartItems" , authentication ,getCartItems);
router.post("/addProductToCart" , authentication ,addProductToCart);
router.put("/updateProductQuantity/:id" , authentication ,updateProductQuantity);
router.delete("/removeProductFromCart/:id" , authentication ,removeProductFromCart);
router.delete("/clearProductsFromCart" , authentication ,clearProductsFromCart);

module.exports = router;