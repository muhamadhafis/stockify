const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const authMiddleware = require('../middleware/auth');
const catchAsync = require('../utils/catchAsync');

router.get('/', authMiddleware, catchAsync(businessController.getBusinesses));
router.post('/', authMiddleware, catchAsync(businessController.createBusiness));
router.patch('/:keyword', authMiddleware, catchAsync(businessController.updateBusiness));
router.delete('/:keyword', authMiddleware, catchAsync(businessController.deleteBusiness));

module.exports = router;
