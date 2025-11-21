const express = require("express");
const { getOrder, postOrder } = require("../controller/order.controller");
const authentication = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/", authentication ,getOrder);
router.post("/", authentication ,postOrder);

module.exports = router;
