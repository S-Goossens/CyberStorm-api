const mongoose = require('mongoose');
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
    defaultAddress: {
        type: Schema.Types.ObjectId,
        ref: 'Address',
        required: false,
    },
    addresses: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Address',
        },
    ],
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Order',
        },
    ],
});

module.exports = mongoose.model('User', userSchema);
