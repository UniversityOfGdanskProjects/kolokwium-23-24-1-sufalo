const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_id: { type: String, required: true, unique: true },
  product_name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  in_stock: { type: Boolean, required: true }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
