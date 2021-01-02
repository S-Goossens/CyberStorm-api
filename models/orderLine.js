const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderLineSchema = new Schema({
    product: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("OrderLine", orderLineSchema);
