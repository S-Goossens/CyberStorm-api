const { ValidationResult } = require("express-validator");

const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");

/**
 * Create order and add it to user's schema
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.createOrder = (req, res, next) => {
    const address = req.body.address;
    const cart = req.body.cart;
    const totalPrice = req.body.totalPrice;

    User.findById(req.userId)
        .then((user) => {
            if (!user) {
                const error = new Error("User not found.");
                error.statusCode = 401;
                throw error;
            }
            const order = new Order({
                userId: req.userId,
                address: address,
                orderLines: cart,
                totalPrice: totalPrice,
            });
            order
                .save()
                .then((result) => {
                    user.orders.push(order);
                    return user.save();
                })
                .then((result) => {
                    res.status(201).json({
                        message: "Order created successfully.",
                        order: order,
                    });
                })
                .catch((err) => {
                    throw err;
                });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
