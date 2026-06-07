const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Route for upload PDF, need authentication
router.post('/upload', authMiddleware, upload.single('file'), documentController.uploadPdf);

module.exports = router;
