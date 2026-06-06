const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// User routes
router.post('/', authMiddleware, orderController.createOrder);
router.get('/my-orders', authMiddleware, orderController.getMyOrders);
router.get('/:id', authMiddleware, orderController.getOrderById);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, orderController.getAllOrders);
router.patch('/:id/status', authMiddleware, adminMiddleware, orderController.updateOrderStatus);

module.exports = router;
