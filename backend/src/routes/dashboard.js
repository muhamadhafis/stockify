const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/auth');
const catchAsync = require('../utils/catchAsync');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Statistics and data overview
 */

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved
 */
router.get('/stats', authMiddleware, catchAsync(dashboardController.getStats));

module.exports = router;
