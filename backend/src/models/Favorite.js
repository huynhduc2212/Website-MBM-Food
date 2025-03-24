const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    id_product: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
    create_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Favorite', favoriteSchema);