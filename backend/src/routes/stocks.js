const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const authMiddleware = require('../middleware/auth');
const catchAsync = require('../utils/catchAsync');

/**
 * @swagger
 * tags:
 *   name: Stocks
 *   description: Inventory stock management
 */

/**
 * @swagger
 * /stocks:
 *   get:
 *     summary: Get current stock list
 *     tags: [Stocks]
 *     responses:
 *       200:
 *         description: Stock list
 */
router.get('/', authMiddleware, catchAsync(stockController.getStock));

/**
 * @swagger
 * /stocks/history:
 *   get:
 *     summary: Get stock transaction history
 *     tags: [Stocks]
 *     responses:
 *       200:
 *         description: Stock history
 */
router.get('/history', authMiddleware, catchAsync(stockController.getStockHistory));

/**
 * @swagger
 * /stocks/adjust:
 *   post:
 *     summary: adjust stock quantity
 *     tags: [Stocks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               part_id:
 *                 type: string
 *               quantity:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [in, out]
 *     responses:
 *       201:
 *         description: Stock adjusted
 */
router.post('/adjust', authMiddleware, catchAsync(stockController.adjustStock));

module.exports = router;
