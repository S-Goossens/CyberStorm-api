const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const userController = require("../controllers/user");
const isAuth = require("../middleware/isAuth");
const router = express.Router();

router.get("/", isAuth, userController.getUser);

module.exports = router;
