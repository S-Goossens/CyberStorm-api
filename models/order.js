const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        address: {
            type: mongoose.Types.ObjectId,
            ref: "Address",
            required: true,
        },
        products: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Product",
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
