const express = require('express');
const router = express.Router();
const sseController = require('../controllers/sseController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/stream', authMiddleware, sseController.connectSSE);

module.exports = router;
