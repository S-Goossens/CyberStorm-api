const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: "Address",
        required: true,
    },
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: "Order",
        },
    ],
    isAdmin: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model("User", userSchema);
