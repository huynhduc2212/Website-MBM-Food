const mongoose = require('mongoose');

const orderDetailSchema = new mongoose.Schema({
    id_order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    id_product: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    name: { type: String, required: true }
});

module.exports = mongoose.model('OrderDetail', orderDetailSchema);