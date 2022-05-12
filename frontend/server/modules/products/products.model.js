const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    src: String,
    name: String,
    code: String,
    category: String,
    quantityPerUnit: String,
    unitPrice: String,
    listPrice: String
});

module.exports = mongoose.model('products', ProductSchema);