const express = require("express");
const { register } = require("../controllers/user.controller.js");

const router = express.Router();

router.route('/register').post(register);

module.exports = router;