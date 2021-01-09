const express = require("express");
const { body } = require("express-validator");

const orderController = require("../controllers/order");

const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/", isAuth, orderController.getOrders);

router.post("/", isAuth, orderController.createOrder);

module.exports = router;
