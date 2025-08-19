
const express = require("express");
const { signUpUser } = require("../controllers/authController");
const { signInUser } = require("../controllers/authController");
const router = express.Router();
router.post("/signup", signUpUser);
router.post("/signin", signInUser);
module.exports = router;
