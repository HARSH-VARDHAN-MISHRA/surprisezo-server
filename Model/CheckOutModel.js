const mongoose = require("mongoose")

const checkoutProduct = new mongoose.Schema({
    cakeName: {
        type: String,
        default: ""
    },
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
})
const checkOutSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    products: { type: Array, required: true },
    totalItems: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    orderStatus: {
        type: String,
        enum: ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Placed'
    },
    paymentMode: {
        type: String,
        enum: ['COD', 'Online'],
        default: 'COD'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    }
}, { timestamps: true });

const Checkout = mongoose.model('CheckOut', checkOutSchema);
module.exports = Checkout