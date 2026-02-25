const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/auth');
const catchAsync = require('../utils/catchAsync');

router.get('/stats', authMiddleware, catchAsync(dashboardController.getStats));

module.exports = router;
