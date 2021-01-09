const { ValidationResult } = require("express-validator");

const Order = require("../models/order");
const Product = require("../models/product");
const OrderLine = require("../models/orderLine");
const User = require("../models/user");
const order = require("../models/order");

/**
 * Create order and add it to user's schema
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.createOrder = async (req, res, next) => {
    const address = req.body.address;
    const cart = JSON.parse(req.body.cart);
    const totalPrice = req.body.totalPrice;

    const orderLines = await saveOrderLines(cart);

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
                orderLines: orderLines,
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

exports.getOrders = (req, res, next) => {
    User.findById(req.userId).then((user) => {
        if (!user) {
            const error = new Error("User not found.");
            error.statusCode = 401;
            throw error;
        }
        Order.find({ userId: user._id })
            .then((result) => {
                res.status(200).json({
                    message: "Orders fetched succesfully.",
                    orders: result,
                });
            })
            .catch((err) => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
    });
};

saveOrderLines = async (cart) => {
    const promises = cart.map(async (item) => {
        const orderLine = new OrderLine({
            product: item.product._id,
            quantity: item.quantity,
        });
        return await orderLine.save().then((result) => {
            return result._id;
        });
    });
    const handledCart = await Promise.all(promises);

    return handledCart;
};
