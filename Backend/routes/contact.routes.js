const express = require("express");
const { getContacts, postContacts } = require("../controller/contact.controller");
const authentication = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/" , authentication ,getContacts);
router.post("/" , postContacts);

module.exports = router;
