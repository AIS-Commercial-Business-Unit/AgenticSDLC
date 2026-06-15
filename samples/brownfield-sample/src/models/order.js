const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  sku: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  customerId: { type: String, required: true, index: true },
  items: { type: [orderItemSchema], required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
    index: true,
  },
  totalAmount: { type: Number },
  shippingAddress: {
    line1: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

orderSchema.pre('save', function (next) {
  this.totalAmount = this.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity, 0
  );
  next();
});

module.exports = mongoose.model('Order', orderSchema);
