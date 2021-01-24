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
    let status = req.body.status;
    if (!status) {
        status = "pending";
    }

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
                status: status,
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

exports.updateOrder = (req, res, next) => {
    const orderId = req.params.orderId;
    const totalPrice = req.body.totalPrice;
    let status = req.body.status;
    if (!status) {
        status = "pending";
    }

    Order.findById(orderId)
        .then((order) => {
            if (!order) {
                const error = new Error("Could not find order.");
                error.statusCode = 404;
                throw error;
            }
            order.totalPrice = totalPrice;
            order.status = status;
            return order.save();
        })
        .then((result) => {
            res.status(200).json({
                message: "Order updated!",
                order: result,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getOrder = (req, res, next) => {
    const orderId = req.params.orderId;

    Order.findById(orderId)
        .then((order) => {
            if (!order) {
                const error = new Error("Could not find order");
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message: "Order fetched.",
                order: order,
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
            const error = new Error("Order not found.");
            error.statusCode = 401;
            throw error;
        }
        Order.find()
            .populate([
                {
                    path: "orderLines",
                    populate: { path: "product", model: "Product" },
                },
                "address",
            ])
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

exports.deleteOrder = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
        .then((order) => {
            if (!order) {
                const error = new Error("Could not find order.");
                error.statusCode = 404;
                throw error;
            }
            return Order.findByIdAndRemove(orderId);
        })
        .then((result) => {
            res.status(200).json({ message: "Deleted order." });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
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
