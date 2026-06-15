const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const Order = require('../models/order');
const authenticate = require('../middleware/auth');

// GET /orders — list all orders (no pagination yet)
router.get('/', authenticate, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /orders/:id — get single order
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /orders — create order
router.post('/',
  authenticate,
  [
    body('customerId').notEmpty().withMessage('customerId is required'),
    body('items').isArray({ min: 1 }).withMessage('items must be a non-empty array'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const order = new Order({
        customerId: req.body.customerId,
        items: req.body.items,
        status: 'pending',
      });
      await order.save();
      res.status(201).json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// PUT /orders/:id — update order status
router.put('/:id',
  authenticate,
  [body('status').isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status, updatedAt: new Date() },
        { new: true }
      );
      if (!order) return res.status(404).json({ error: 'Order not found' });
      res.json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE /orders/:id — cancel order
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled', updatedAt: new Date() },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order cancelled', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
