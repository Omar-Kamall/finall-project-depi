const express = require("express");
const { register, login, updateProfile, deleteAcounct } = require("../controller/user.controller");
const router = express.Router();

router.post("/register" , register);
router.post("/login" , login);
router.put("/updateProfile/:email" , updateProfile);
router.delete("/deleteAccount/:email" , deleteAcounct);

module.exports = router;