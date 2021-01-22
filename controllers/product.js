const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator");

const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
    Product.find()
        .then((products) => {
            // products = generateImageUrl(req, products);
            res.status(200).json({
                message: "Fetched products succesfully.",
                products: products,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

/**
 * Function for the creation of products
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.createProduct = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed, entered data is incorrect");
        error.statusCode = 422;
        throw error;
    }

    const name = req.body.name;
    const imgPath = req.body.imgPath;
    const description = req.body.description;
    const price = req.body.price;
    const type = req.body.type;

    const product = new Product({
        name,
        imgPath,
        description,
        price,
        type,
    });

    product
        .save()
        .then((result) => {
            res.status(201).json({
                message: "Product created succesfully",
                product: product,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then((product) => {
            if (!product) {
                const error = new Error("Could not find product");
                error.statusCode = 404;
                throw error;
            }
            // product = generateImageUrl(req, [product]);
            res.status(200).json({
                message: "Product fetched.",
                product: product,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.updateProduct = (req, res, next) => {
    const productId = req.params.productId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error(
            "Validation failed, entered data is incorrect."
        );
        error.statusCode = 422;
        throw error;
    }
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const type = req.body.type;
    const imgPath = req.body.imgPath;

    Product.findById(productId)
        .then((product) => {
            if (!product) {
                const error = new Error("Could not find product.");
                error.statusCode = 404;
                throw error;
            }
            product.name = name;
            product.imgPath = imgPath;
            product.description = description;
            product.price = price;
            product.type = type;
            return product.save();
        })
        .then((result) => {
            res.status(200).json({
                message: "Product updated!",
                product: result,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.deleteProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then((product) => {
            if (!product) {
                const error = new Error("Could not find product.");
                error.statusCode = 404;
                throw error;
            }
            return Product.findByIdAndRemove(productId);
        })
        .then((result) => {
            res.status(200).json({ message: "Deleted product." });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

// const clearImage = (filePath) => {
//     filePath = path.join(__dirname, "..", filePath);
//     fs.unlink(filePath, (err) => console.log(err));
// };

// const generateImageUrl = (req, products) => {
//     for (const product in products) {
//         products[product].imgPath =
//             req.protocol +
//             "://" +
//             req.get("host") +
//             "/" +
//             products[product].imgPath;
//     }
//     return products;
// };
