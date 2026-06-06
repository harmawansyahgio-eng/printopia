const express = require('express');
const router = express.Router();
const { getSettingsHandler, updateSettingsHandler } = require('../controllers/settingsController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/', getSettingsHandler);
router.put('/', authMiddleware, adminMiddleware, updateSettingsHandler);

module.exports = router;
