const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;


const productCartSchema = new mongoose.Schema({
    product: {
        type: ObjectId,
        ref: "Product"
    },
    name: String,
    count: Number,
    price: Number
});
const orderSchema = mongoose.Schema({
    products : [productCartSchema],
    transaction_id: {},
    amount: {type: Number},
    address: String,
    updated: Date,
    status: {
        type: String,
        enum: ['cancelled', 'delivered', 'shipped', 'processing', 'received'],
        default: 'received'
    },
    user: {
        type: ObjectId,
        ref: "User"
    }
}, {timestamps: true});


const order = mongoose.model('Order', orderSchema);
const productCart = mongoose.model('ProductCart', productCartSchema);

module.exports = {order, productCart}