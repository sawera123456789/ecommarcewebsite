const express = require('express');
const { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.get('/admin/all', protect, authorize('admin'), getAllOrders);
router.put('/admin/:id', protect, authorize('admin'), updateOrderStatus);

module.exports = router;
