const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_id: { type: String, required: true, unique: true },
  customer_id: { type: String, required: true },
  product_id: { type: String, required: true },
  quantity: { type: Number, required: true },
  order_date: { type: String, required: true },
  status: { type: String, required: true }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
