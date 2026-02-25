const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const authMiddleware = require('../middleware/auth');
const catchAsync = require('../utils/catchAsync');

router.get('/', authMiddleware, catchAsync(stockController.getStock));
router.get('/history', authMiddleware, catchAsync(stockController.getStockHistory));
router.post('/adjust', authMiddleware, catchAsync(stockController.adjustStock));

module.exports = router;
